from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from typing import List, Optional
from fastapi import Request, HTTPException
from app.models.settings.router_permission import Router, Permission, RouterPermission
from app.schemas.settings.router_permission import (
    RouterCreate, RouterUpdate, RouterResponse,
    PermissionCreate, PermissionUpdate, PermissionResponse,
    RouterPermissionCreate, RouterPermissionUpdate, RouterPermissionResponse, RouterPermissionWithDetails
)
from app.schemas.generic_response import GenericResponse
from app.core.http_exceptions import http_400, http_404, http_500
from app.core.redis import publish_update


# ========= ROUTER CRUD =========

def get_all_routers(db: Session) -> GenericResponse[List[RouterResponse]]:
    try:
        routers = db.query(Router).all()
        routerdata = [RouterResponse.from_orm(r) for r in routers]
        return GenericResponse(data=routerdata, message="notification.fetch.success", args={"entity": "Router"})
    except HTTPException:
        raise
    except Exception:
        raise http_500("error.fetch.failed", {"entity": "Router"})


def get_router_by_id(db: Session, router_id: UUID) -> GenericResponse[RouterResponse]:
    r = db.query(Router).filter(Router.id == router_id).first()
    if not r:
        http_404("error.router.not_found", {"id": router_id})
    return GenericResponse(data=RouterResponse.from_orm(r), message="notification.fetch.success", args={"entity": "Router"})


async def create_router(db: Session, data: RouterCreate) -> GenericResponse[RouterResponse]:
    r = Router(**data.dict())
    try:
        db.add(r)
        db.commit()
        db.refresh(r)
    except IntegrityError:
        db.rollback()
        http_400("error.router.duplicate", {"path": data.path, "method": data.method})
    except Exception:
        db.rollback()
        http_500("notification.create.failed", {"entity": "Router"})
    await publish_update("create", "router", RouterResponse.from_orm(r).model_dump())
    return GenericResponse(data=RouterResponse.from_orm(r), message="notification.create.success", args={"entity": "Router"})


async def update_router(db: Session, router_id: UUID, data: RouterUpdate) -> GenericResponse[RouterResponse]:
    r = db.query(Router).filter(Router.id == router_id).first()
    if not r:
        http_404("error.router.not_found", {"id": router_id})
    for field, val in data.dict().items():
        setattr(r, field, val)
    try:
        db.commit()
        db.refresh(r)
    except IntegrityError:
        db.rollback()
        http_400("error.router.duplicate", {"path": data.path, "method": data.method})
    except Exception:
        db.rollback()
        http_500("notification.update.failed", {"entity": "Router"})
    await publish_update("update", "router", RouterResponse.from_orm(r).model_dump())
    return GenericResponse(data=RouterResponse.from_orm(r), message="notification.update.success", args={"entity": "Router"})


async def delete_router(db: Session, router_id: UUID, request: Request) -> GenericResponse[None]:
    r = db.query(Router).filter(Router.id == router_id).first()
    if not r:
        http_404("error.router.not_found", {"id": router_id})
    await publish_update("delete", "router", RouterResponse.from_orm(r).model_dump())
    try:
        db.delete(r)
        db.commit()
    except Exception:
        db.rollback()
        http_500("notification.delete.failed", {"entity": "Router"})
    return GenericResponse(
        data=None,
        message="notification.delete.success",
        args={"entity": "Router"}
        )


# ========= PERMISSION CRUD =========

def get_all_permissions(db: Session) -> GenericResponse[List[PermissionResponse]]:
    try:
        perms = db.query(Permission).all()
        data = [PermissionResponse.from_orm(p) for p in perms]
        return GenericResponse(data=data, message="notification.fetch.success", args={"entity": "Permission"})
    except HTTPException:
        raise
    except Exception:
        raise http_500("error.fetch.failed", {"entity": "Permission"})


def get_permission_by_id(db: Session, permission_id: UUID) -> GenericResponse[PermissionResponse]:
    p = db.query(Permission).filter(Permission.id == permission_id).first()
    if not p:
        http_404("error.permission.not_found", {"id": permission_id})
    return GenericResponse(data=PermissionResponse.from_orm(p), message="notification.fetch.success", args={"entity": "Permission"})


async def create_permission(db: Session, data: PermissionCreate) -> GenericResponse[PermissionResponse]:
    p = Permission(**data.dict())
    try:
        db.add(p)
        db.commit()
        db.refresh(p)
    except IntegrityError:
        db.rollback()
        http_400("error.permission.duplicate", {"key": f"{data.resource}.{data.action}"})
    except Exception:
        db.rollback()
        http_500("notification.create.failed", {"entity": "Permission"})
    await publish_update("create", "permission", PermissionResponse.from_orm(p).model_dump())
    return GenericResponse(data=PermissionResponse.from_orm(p), message="notification.create.success", args={"entity": "Permission"})


async def update_permission(db: Session, permission_id: UUID, data: PermissionUpdate) -> GenericResponse[PermissionResponse]:
    p = db.query(Permission).filter(Permission.id == permission_id).first()
    if not p:
        http_404("error.permission.not_found", {"id": permission_id})
    for field, val in data.dict().items():
        setattr(p, field, val)
    try:
        db.commit()
        db.refresh(p)
    except IntegrityError:
        db.rollback()
        http_400("error.permission.duplicate", {"key": data.permission_key})
    except Exception:
        db.rollback()
        http_500("notification.update.failed", {"entity": "Permission"})
    await publish_update("update", "permission", PermissionResponse.from_orm(p).model_dump())
    return GenericResponse(data=PermissionResponse.from_orm(p), message="notification.update.success", args={"entity": "Permission"})


async def delete_permission(db: Session, permission_id: UUID) -> GenericResponse[None]:
    p = db.query(Permission).filter(Permission.id == permission_id).first()
    if not p:
        http_404("error.permission.not_found", {"id": permission_id})
    await publish_update("delete", "permission", PermissionResponse.from_orm(p).model_dump())
    try:
        db.delete(p)
        db.commit()
    except Exception:
        db.rollback()
        http_500("notification.delete.failed", {"entity": "Permission"})
    return GenericResponse(data=None, message="notification.delete.success", args={"entity": "Permission"})


# ========= ROUTER-PERMISSION BINDING CRUD =========

def get_all_router_permissions(db: Session) -> GenericResponse[List[RouterPermissionWithDetails]]:
    try:
        items = (
            db.query(RouterPermission)
            .join(RouterPermission.router)
            .join(RouterPermission.permission)
            .options(joinedload(RouterPermission.router), joinedload(RouterPermission.permission))
            .all()
        )
        data = [RouterPermissionWithDetails.from_orm(rp) for rp in items]
        return GenericResponse(data=data, message="notification.fetch.success", args={"entity": "Binding"})
    except HTTPException:
        raise
    except Exception:
        raise http_500("error.fetch.failed", {"entity": "Binding"})


def get_router_permission_by_id(db: Session, rp_id: UUID) -> GenericResponse[RouterPermissionResponse]:
    rp = db.query(RouterPermission).filter(RouterPermission.id == rp_id).first()
    if not rp:
        http_404("error.binding.not_found", {"id": rp_id})
    return GenericResponse(data=RouterPermissionResponse.from_orm(rp), message="notification.fetch.success", args={"entity": "Binding"})


async def create_router_permission(db: Session, data: RouterPermissionCreate) -> GenericResponse[RouterPermissionResponse]:
    rp = RouterPermission(**data.dict())
    try:
        db.add(rp)
        db.commit()
        db.refresh(rp)
    except IntegrityError:
        db.rollback()
        http_400("error.binding.duplicate", {"router_id": data.router_id, "permission_id": data.permission_id})
    except Exception:
        db.rollback()
        http_500("notification.create.failed", {"entity": "Binding"})
    await publish_update("create", "binding", RouterPermissionResponse.from_orm(rp).model_dump())
    return GenericResponse(data=RouterPermissionResponse.from_orm(rp), message="notification.create.success", args={"entity": "Binding"})


async def update_router_permission(db: Session, rp_id: UUID, data: RouterPermissionUpdate) -> GenericResponse[RouterPermissionResponse]:
    rp = db.query(RouterPermission).filter(RouterPermission.id == rp_id).first()
    if not rp:
        http_404("error.binding.not_found", {"id": rp_id})
    for field, val in data.dict().items():
        setattr(rp, field, val)
    try:
        db.commit()
        db.refresh(rp)
    except IntegrityError:
        db.rollback()
        http_400("error.binding.duplicate", {"router_id": data.router_id, "permission_id": data.permission_id})
    except Exception:
        db.rollback()
        http_500("notification.update.failed", {"entity": "Binding"})
    await publish_update("update", "binding", RouterPermissionResponse.from_orm(rp).model_dump())
    return GenericResponse(data=RouterPermissionResponse.from_orm(rp), message="notification.update.success", args={"entity": "Binding"})


async def delete_router_permission(db: Session, rp_id: UUID) -> GenericResponse[None]:
    rp = db.query(RouterPermission).filter(RouterPermission.id == rp_id).first()
    if not rp:
        http_404("error.binding.not_found", {"id": rp_id})
    await publish_update("delete", "binding", RouterPermissionResponse.from_orm(rp).model_dump())
    try:
        db.delete(rp)
        db.commit()
    except Exception:
        db.rollback()
        http_500("notification.delete.failed", {"entity": "Binding"})
    return GenericResponse(data=None, message="notification.delete.success", args={"entity": "Binding"})
