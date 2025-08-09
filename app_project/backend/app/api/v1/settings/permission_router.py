from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.core.permissions import permission_required_root
from app.services.settings.router_service import get_available_routes_service
from app.schemas.generic_response import GenericResponse
from app.schemas.settings.router_permission import (
    RouterCreate, RouterUpdate, RouterResponse,
    PermissionCreate, PermissionUpdate, PermissionResponse,
    RouterPermissionCreate, RouterPermissionUpdate, RouterPermissionResponse, RouterPermissionWithDetails
)
from app.core.permissions import permission_required
from app.services.settings.permission_router_service import (
    create_router, get_all_routers, get_router_by_id, update_router, delete_router,
    create_permission, get_all_permissions, get_permission_by_id, update_permission, delete_permission,
    create_router_permission, get_all_router_permissions, get_router_permission_by_id,
    update_router_permission, delete_router_permission, get_all_router_permissions
)

router = APIRouter(
    prefix="/router-permissions",
    tags=["Router & Permissions"],
    dependencies=[Depends(permission_required())] 
)

# ====== ROUTER ======

@router.get("/routers/available")
def get_available_routes(
    request: Request,
    db: Session = Depends(get_db)
):
    return {
        "available_routes": get_available_routes_service(request.app, db)
    }

@router.get("/routers")
def list_routers(db: Session = Depends(get_db)):
    return get_all_routers(db)

@router.post("/routers")
async def create_new_router(data: RouterCreate, db: Session = Depends(get_db)):
    return await create_router(db, data)

@router.get("/routers/{router_id}")
def get_router(router_id: UUID, db: Session = Depends(get_db)):
    return get_router_by_id(db, router_id)

@router.put("/routers/{router_id}")
async def update_router_by_id(router_id: UUID, data: RouterUpdate, db: Session = Depends(get_db)):
    return await update_router(db, router_id, data)

@router.delete("/routers/{router_id}")
async def delete_router_by_id(request: Request, router_id: UUID, db: Session = Depends(get_db)):
   return await delete_router(db, router_id, request)

# ====== PERMISSION ======

@router.get("/permissions")
def list_permissions(db: Session = Depends(get_db)):
    return get_all_permissions(db)

@router.post("/permissions")
async def create_new_permission(data: PermissionCreate, db: Session = Depends(get_db)):
    return await create_permission(db, data)

@router.get("/permissions/{permission_id}")
def get_permission(permission_id: UUID, db: Session = Depends(get_db)):
    return get_permission_by_id(db, permission_id)

@router.put("/permissions/{permission_id}")
async def update_permission_by_id(permission_id: UUID, data: PermissionUpdate, db: Session = Depends(get_db)):
    return await update_permission(db, permission_id, data)

@router.delete("/permissions/{permission_id}")
async def delete_permission_by_id(permission_id: UUID, db: Session = Depends(get_db)):
    return await delete_permission(db, permission_id)

# ====== ROUTER-PERMISSION LINK ======

@router.get("/bindings")
def list_router_permissions(db: Session = Depends(get_db)):
    return get_all_router_permissions(db)

@router.get("/bindings/details")
def list_router_permissions_with_details(db: Session = Depends(get_db)):
    return get_all_router_permissions(db)

@router.post("/bindings")
async def bind_router_permission(data: RouterPermissionCreate, db: Session = Depends(get_db)):
    return await create_router_permission(db, data)

@router.get("/bindings/{binding_id}")
def get_router_permission_binding(binding_id: UUID, db: Session = Depends(get_db)):
    return get_router_permission_by_id(db, binding_id)

@router.put("/bindings/{binding_id}")
async def update_router_permission_binding(binding_id: UUID, data: RouterPermissionUpdate, db: Session = Depends(get_db)):
    return await update_router_permission(db, binding_id, data)

@router.delete("/bindings/{binding_id}")
async def delete_router_permission_binding(binding_id: UUID, db: Session = Depends(get_db)):
    return await delete_router_permission(db, binding_id)

