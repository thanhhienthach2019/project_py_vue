from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from typing import List

from app.models.settings.router_permission import Router, Permission, RouterPermission
from app.schemas.settings.router_permission import (
    RouterCreate, RouterUpdate, RouterResponse,
    PermissionCreate, PermissionUpdate, PermissionResponse,
    RouterPermissionCreate, RouterPermissionUpdate, RouterPermissionResponse, RouterPermissionWithDetails
)
from app.core.redis import publish_update
# ========= ROUTER CRUD =========

async def create_router(db: Session, data: RouterCreate) -> RouterResponse:
    r = Router(**data.dict())
    db.add(r)
    db.commit()
    db.refresh(r)

    await publish_update("create", "router", RouterResponse.from_orm(r).model_dump())
    return RouterResponse.model_validate(r)


def get_all_routers(db: Session) -> List[RouterResponse]:
    routers = db.query(Router).all()
    return [RouterResponse.model_validate(r) for r in routers]


def get_router_by_id(db: Session, router_id: int) -> RouterResponse:
    r = db.query(Router).filter(Router.id == router_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Router not found")
    return RouterResponse.model_validate(r)


async def update_router(db: Session, router_id: int, data: RouterUpdate) -> RouterResponse:
    r = db.query(Router).filter(Router.id == router_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Router not found")
    for field, value in data.dict().items():
        setattr(r, field, value)
    db.commit()
    db.refresh(r)

    await publish_update("update", "router", RouterResponse.from_orm(r).model_dump())
    return RouterResponse.model_validate(r)


async def delete_router(db: Session, router_id: int) -> None:
    r = db.query(Router).filter(Router.id == router_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Router not found")
    db.query(RouterPermission).filter(RouterPermission.router_id == router_id).delete()
    db.delete(r)
    db.commit()

    await publish_update("delete", "router", RouterResponse.from_orm(r).model_dump())

# ========= PERMISSION CRUD =========

async def create_permission(db: Session, data: PermissionCreate) -> PermissionResponse:
    p = Permission(**data.dict())
    db.add(p)
    db.commit()
    db.refresh(p)

    await publish_update("create", "permission", PermissionResponse.from_orm(p).model_dump())

    return PermissionResponse.model_validate(p)


def get_all_permissions(db: Session) -> List[PermissionResponse]:
    permissions = db.query(Permission).all()
    return [PermissionResponse.model_validate(p) for p in permissions]


def get_permission_by_id(db: Session, permission_id: int) -> PermissionResponse:
    p = db.query(Permission).filter(Permission.id == permission_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Permission not found")
    return PermissionResponse.model_validate(p)


async def update_permission(db: Session, permission_id: int, data: PermissionUpdate) -> PermissionResponse:
    p = db.query(Permission).filter(Permission.id == permission_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Permission not found")
    for field, value in data.dict().items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)

    await publish_update("update", "permission", PermissionResponse.from_orm(p).model_dump())

    return PermissionResponse.model_validate(p)


async def delete_permission(db: Session, permission_id: int) -> None:
    p = db.query(Permission).filter(Permission.id == permission_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Permission not found")
    db.query(RouterPermission).filter(RouterPermission.permission_id == permission_id).delete()
    db.delete(p)
    db.commit()

    await publish_update("delete", "permission", PermissionResponse.from_orm(p).model_dump())

# ========= ROUTER PERMISSION CRUD =========

async def create_router_permission(db: Session, data: RouterPermissionCreate) -> RouterPermissionResponse:
    rp = RouterPermission(**data.dict())
    db.add(rp)
    db.commit()
    db.refresh(rp)

    await publish_update("create", "binding", RouterPermissionResponse.from_orm(rp).model_dump())

    return RouterPermissionResponse.model_validate(rp)


def get_all_router_permissions(db: Session) -> List[RouterPermissionWithDetails]:
    items = (
        db.query(RouterPermission)
        .join(RouterPermission.router)
        .join(RouterPermission.permission)
        .options(joinedload(RouterPermission.router), joinedload(RouterPermission.permission))
        .all()
    )
    return [RouterPermissionWithDetails.model_validate(rp) for rp in items]


def get_router_permission_by_id(db: Session, rp_id: int) -> RouterPermissionResponse:
    rp = db.query(RouterPermission).filter(RouterPermission.id == rp_id).first()
    if not rp:
        raise HTTPException(status_code=404, detail="RouterPermission not found")
    return RouterPermissionResponse.model_validate(rp)


async def update_router_permission(db: Session, rp_id: int, data: RouterPermissionUpdate) -> RouterPermissionResponse:
    rp = db.query(RouterPermission).filter(RouterPermission.id == rp_id).first()
    if not rp:
        raise HTTPException(status_code=404, detail="RouterPermission not found")
    for field, value in data.dict().items():
        setattr(rp, field, value)
    db.commit()
    db.refresh(rp)

    await publish_update("update", "binding", RouterPermissionResponse.from_orm(rp).model_dump())

    return RouterPermissionResponse.model_validate(rp)


async def delete_router_permission(db: Session, rp_id: int) -> None:
    rp = db.query(RouterPermission).filter(RouterPermission.id == rp_id).first()
    if not rp:
        raise HTTPException(status_code=404, detail="RouterPermission not found")
    db.delete(rp)
    db.commit()

    await publish_update("delete", "binding", RouterPermissionResponse.from_orm(rp).model_dump())

def get_all_router_permissions_with_details(db: Session) -> List[RouterPermissionWithDetails]:
    items = (
        db.query(RouterPermission)
        .join(RouterPermission.router)
        .join(RouterPermission.permission)
        .options(joinedload(RouterPermission.router), joinedload(RouterPermission.permission))
        .all()
    )
    return [RouterPermissionWithDetails.model_validate(rp) for rp in items]