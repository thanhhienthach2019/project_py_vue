from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from typing import Optional, List, Dict
from fastapi import Request
from app.core.http_exceptions import http_404, http_400, http_500
from app.models.settings.MenuItem import MenuItem
from app.schemas.settings.MenuItem import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse
)
from app.schemas.generic_response import GenericResponse
from app.core.casbin import enforcer
from app.core.redis import publish_update


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


def get_all_menu_items_response(db: Session) -> GenericResponse[List[MenuItemResponse]]:
    try:
        items = get_all_menu_items(db)

        result = [
            MenuItemResponse(
                id=i.id,
                title=i.title,
                path=i.path,
                icon=i.icon,
                permission_key=i.permission_key,
                parent_id=i.parent_id,
                order=i.order,
                version=i.version,
                children=[]
            )
            for i in items
        ]
        
        return GenericResponse(
            data=result,
            message="notification.fetch.success",
            args={"entity": "Menu"}
        )
    except Exception as e:
        raise http_500("error.fetch.failed", {"entity": "Menu"})


def get_menu_tree_for_user(db: Session, username: str) -> GenericResponse[List[MenuItemResponse]]:
    try:
        raw = get_all_menu_items(db)
        allowed = [
            {
                "id": it.id,
                "title": it.title,
                "path": it.path,
                "icon": it.icon,
                "permission_key": it.permission_key,
                "parent_id": it.parent_id,
                "order": it.order,
            }
            for it in raw
            if enforcer.enforce(username, it.permission_key, "view")
        ]
        tree = _build_tree(allowed)
        result = [MenuItemResponse(**node) for node in tree]
        return GenericResponse(
            data=result,
            message="notification.fetch.success",
            args={"entity": "Menu"}
        )
    except Exception:
        raise http_500("error.fetch.failed", {"entity": "Menu"})


# 🟢 CREATE
async def create_menu_item(
    db: Session,
    data: MenuItemCreate,
    parent_id: Optional[UUID] = None
) -> GenericResponse[MenuItemResponse]:
    try:
        m = MenuItem(
            title=data.title,
            path=data.path,
            icon=data.icon,
            permission_key=data.permission_key,
            parent_id=parent_id or data.parent_id,
            version=data.version,
            order=data.order
        )
        db.add(m)
        db.commit()
        db.refresh(m)
    except IntegrityError:
        db.rollback()
        raise http_400("error.menu.permission_key_conflict", {"key": data.permission_key})
    except Exception as e:
        db.rollback()
        raise http_500("error.create.failed", {"entity": "Menu"})

    try:
        await publish_update("create", "menu", MenuItemResponse.from_orm(m).model_dump())
    except Exception:
        pass  

    children = []
    for child in (data.children or []):
        try:
            child_resp = await create_menu_item(db, child, parent_id=m.id)
            children.append(child_resp.data)
        except Exception:
            continue 

    item = MenuItemResponse(
        id=m.id,
        title=m.title,
        path=m.path,
        icon=m.icon,
        permission_key=m.permission_key,
        parent_id=m.parent_id,
        order=m.order,
        version=m.version,
        children=children
    )
    return GenericResponse(
        data=item,
        message="notification.create.success",
        args={"entity": "Menu"}
    )


# 🟡 UPDATE
async def update_menu_item(
    db: Session,
    menu_id: UUID,
    data: MenuItemUpdate,
    request: Request
) -> GenericResponse[MenuItemResponse]:
    m = db.query(MenuItem).filter(MenuItem.id == menu_id).first()
    if not m:
        raise http_404("error.menu.not_found", {"id": menu_id})

    for field, val in data.dict().items():
        setattr(m, field, val)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise http_400("error.menu.permission_key_conflict", {"key": data.permission_key})
    except Exception:
        db.rollback()
        raise http_500("error.update.failed", {"entity": "Menu"})

    db.refresh(m)

    try:
        await publish_update("update", "menu", MenuItemResponse.from_orm(m).model_dump())
    except Exception:
        pass

    return GenericResponse(
        data=MenuItemResponse.from_orm(m),
        message="notification.update.success",
        args={"entity": "Menu"}
    )


# 🔴 DELETE
async def delete_menu_item(
    db: Session,
    menu_id: UUID,
    request: Request
) -> GenericResponse[None]:
    m = db.query(MenuItem).filter(MenuItem.id == menu_id).first()
    if not m:
        raise http_404("error.menu.not_found", {"id": menu_id})

    try:
        await publish_update("delete", "menu", MenuItemResponse.from_orm(m).model_dump())
    except Exception:
        pass

    try:
        db.delete(m)
        db.commit()
    except Exception:
        db.rollback()
        raise http_500("error.delete.failed", {"entity": "Menu"})

    return GenericResponse(
        data=None,
        message="notification.delete.success",
        args={"entity": "Menu"}
    )