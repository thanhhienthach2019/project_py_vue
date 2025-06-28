from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from fastapi import HTTPException, status

from app.models.menu.MenuItem import MenuItem
from app.schemas.menu.MenuItem import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse
)
from app.core.casbin import enforcer


def _build_tree(items: List[Dict]) -> List[Dict]:
    """
    Convert a flat list of menu items into a hierarchical tree structure based on parent-child relationships.

    Args:
        items (List[Dict]): A list of menu items with 'parent_id' attributes.

    Returns:
        List[Dict]: A nested tree structure representing the menu hierarchy.
    """
    lookup = {item["id"]: {**item, "children": []} for item in items}
    tree: List[Dict] = []
    for item in lookup.values():
        pid = item["parent_id"]
        if pid and pid in lookup:
            lookup[pid]["children"].append(item)
        else:
            tree.append(item)
    return tree


def get_all_menu_items(db: Session) -> List[MenuItem]:
    """
    Retrieve all menu items from the database, ordered by their 'order' field.

    Args:
        db (Session): SQLAlchemy session.

    Returns:
        List[MenuItem]: List of all menu items.
    """
    return db.query(MenuItem).order_by(MenuItem.order).all()

def get_all_menu_items_response(db: Session) -> List[MenuItemResponse]:
    """
    Get all menu items and transform them to MenuItemResponse schema.
    This avoids pydantic validation error on `children` field.
    """
    items = get_all_menu_items(db)

    def map_item(it: MenuItem) -> MenuItemResponse:
        return MenuItemResponse(
            id=it.id,
            title=it.title,
            path=it.path,
            icon=it.icon,
            permission_key=it.permission_key,
            parent_id=it.parent_id,
            order=it.order,
            children=[]  # Always return list
        )

    return [map_item(i) for i in items]

def get_menu_tree_for_user(db: Session, username: str) -> List[MenuItemResponse]:
    """
    Retrieve a filtered tree of menu items the given user is authorized to view based on Casbin policies.

    Args:
        db (Session): SQLAlchemy session.
        username (str): The username of the requesting user.

    Returns:
        List[MenuItemResponse]: A tree-structured list of authorized menu items.
    """
    raw = get_all_menu_items(db)
    allowed: List[Dict] = []
    for it in raw:
        if enforcer.enforce(username, it.permission_key, "view"):
            allowed.append({
                "id": it.id,
                "title": it.title,
                "path": it.path,
                "icon": it.icon,
                "permission_key": it.permission_key,
                "parent_id": it.parent_id,
                "order": it.order,
            })
    tree = _build_tree(allowed)
    return [MenuItemResponse(**node) for node in tree]


def create_menu_item(db: Session, data: MenuItemCreate, parent_id: Optional[int] = None) -> MenuItemResponse:
    """
    Create a new menu item and recursively create its children if provided.

    Args:
        db (Session): SQLAlchemy session.
        data (MenuItemCreate): Input schema containing the menu item data and optional children.
        parent_id (Optional[int]): Explicit parent ID to override input data (used in recursion).

    Returns:
        MenuItemResponse: The created menu item along with its children (if any).
    """
    m = MenuItem(
        title=data.title,
        path=data.path,
        icon=data.icon,
        permission_key=data.permission_key,
        parent_id=parent_id or data.parent_id,
        order=data.order
    )
    db.add(m)
    db.commit()
    db.refresh(m)

    children_responses = []
    for child_data in data.children or []:
        child_response = create_menu_item(db, child_data, parent_id=m.id)
        children_responses.append(child_response)

    return MenuItemResponse(
        id=m.id,
        title=m.title,
        path=m.path,
        icon=m.icon,
        permission_key=m.permission_key,
        parent_id=m.parent_id,
        order=m.order,
        children=children_responses
    )


def update_menu_item(db: Session, menu_id: int, data: MenuItemUpdate) -> MenuItemResponse:
    """
    Update an existing menu item by its ID.

    Args:
        db (Session): SQLAlchemy session.
        menu_id (int): The ID of the menu item to update.
        data (MenuItemUpdate): Input schema with updated fields.

    Raises:
        HTTPException: If the menu item with the given ID does not exist.

    Returns:
        MenuItemResponse: The updated menu item.
    """
    m = db.query(MenuItem).filter(MenuItem.id == menu_id).first()
    if not m:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MenuItem {menu_id} does not exist"
        )
    for field, val in data.dict().items():
        setattr(m, field, val)
    db.commit()
    db.refresh(m)

    return MenuItemResponse(
        id=m.id,
        title=m.title,
        path=m.path,
        icon=m.icon,
        permission_key=m.permission_key,
        parent_id=m.parent_id,
        order=m.order,
        children=[]
    )


def delete_menu_item(db: Session, menu_id: int) -> None:
    """
    Delete a menu item by its ID.

    Args:
        db (Session): SQLAlchemy session.
        menu_id (int): The ID of the menu item to delete.

    Raises:
        HTTPException: If the menu item does not exist.
    """
    m = db.query(MenuItem).filter(MenuItem.id == menu_id).first()
    if not m:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MenuItem {menu_id} does not exist"
        )
    db.delete(m)
    db.commit()
