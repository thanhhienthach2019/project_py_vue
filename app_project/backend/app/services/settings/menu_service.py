from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from fastapi import HTTPException, status

from app.models.settings.MenuItem import MenuItem
from app.schemas.settings.MenuItem import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse
)
from app.core.casbin import enforcer


def _build_tree(items: List[Dict]) -> List[Dict]:
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
    return db.query(MenuItem).order_by(MenuItem.order).all()

def get_all_menu_items_response(db: Session) -> List[MenuItemResponse]:
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
    m = db.query(MenuItem).filter(MenuItem.id == menu_id).first()
    if not m:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MenuItem {menu_id} does not exist"
        )
    db.delete(m)
    db.commit()
