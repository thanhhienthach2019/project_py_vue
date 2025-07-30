from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.permissions import permission_required_root
from app.services.settings.router_service import get_available_routes_service

from app.schemas.settings.router_permission import (
    RouterCreate, RouterUpdate, RouterResponse,
    PermissionCreate, PermissionUpdate, PermissionResponse,
    RouterPermissionCreate, RouterPermissionUpdate, RouterPermissionResponse, RouterPermissionWithDetails
)

from app.services.settings.permission_router_service import (
    create_router, get_all_routers, get_router_by_id, update_router, delete_router,
    create_permission, get_all_permissions, get_permission_by_id, update_permission, delete_permission,
    create_router_permission, get_all_router_permissions, get_router_permission_by_id,
    update_router_permission, delete_router_permission, get_all_router_permissions_with_details
)

router = APIRouter(
    prefix="/router-permissions",
    tags=["Router & Permissions"]
)

# ====== ROUTER ======

@router.get(
    "/routers/available",
    summary="Get all available routes not yet registered in DB",
    dependencies=[Depends(permission_required_root("menu:settings:router", "read"))]
)
def get_available_routes(
    request: Request,
    db: Session = Depends(get_db)
):
    return {
        "available_routes": get_available_routes_service(request.app, db)
    }

@router.get("/routers", response_model=List[RouterResponse],
            dependencies=[Depends(permission_required_root("menu:settings:router", "read"))])
def list_routers(db: Session = Depends(get_db)):
    return get_all_routers(db)

@router.post("/routers", response_model=RouterResponse, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(permission_required_root("menu:settings:router", "create"))])
async def create_new_router(data: RouterCreate, db: Session = Depends(get_db)):
    return await create_router(db, data)

@router.get("/routers/{router_id}", response_model=RouterResponse,
            dependencies=[Depends(permission_required_root("menu:settings:router", "read"))])
def get_router(router_id: int, db: Session = Depends(get_db)):
    return get_router_by_id(db, router_id)

@router.put("/routers/{router_id}", response_model=RouterResponse,
            dependencies=[Depends(permission_required_root("menu:settings:router", "update"))])
async def update_router_by_id(router_id: int, data: RouterUpdate, db: Session = Depends(get_db)):
    return await update_router(db, router_id, data)

@router.delete("/routers/{router_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(permission_required_root("menu:settings:router", "delete"))])
async def delete_router_by_id(router_id: int, db: Session = Depends(get_db)):
   await delete_router(db, router_id)

# ====== PERMISSION ======

@router.get("/permissions", response_model=List[PermissionResponse],
            dependencies=[Depends(permission_required_root("menu:settings:permission", "read"))])
def list_permissions(db: Session = Depends(get_db)):
    return get_all_permissions(db)

@router.post("/permissions", response_model=PermissionResponse, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(permission_required_root("menu:settings:permission", "create"))])
async def create_new_permission(data: PermissionCreate, db: Session = Depends(get_db)):
    return await create_permission(db, data)

@router.get("/permissions/{permission_id}", response_model=PermissionResponse,
            dependencies=[Depends(permission_required_root("menu:settings:permission", "read"))])
def get_permission(permission_id: int, db: Session = Depends(get_db)):
    return get_permission_by_id(db, permission_id)

@router.put("/permissions/{permission_id}", response_model=PermissionResponse,
            dependencies=[Depends(permission_required_root("menu:settings:permission", "update"))])
async def update_permission_by_id(permission_id: int, data: PermissionUpdate, db: Session = Depends(get_db)):
    return await update_permission(db, permission_id, data)

@router.delete("/permissions/{permission_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(permission_required_root("menu:settings:permission", "delete"))])
async def delete_permission_by_id(permission_id: int, db: Session = Depends(get_db)):
    await delete_permission(db, permission_id)

# ====== ROUTER-PERMISSION LINK ======

@router.get("/bindings", response_model=List[RouterPermissionResponse],
            dependencies=[Depends(permission_required_root("menu:settings:router-permission", "read"))])
def list_router_permissions(db: Session = Depends(get_db)):
    return get_all_router_permissions(db)

@router.get(
    "/bindings/details",
    response_model=List[RouterPermissionWithDetails],
    dependencies=[Depends(permission_required_root("menu:settings:router-permission", "read"))]
)
def list_router_permissions_with_details(db: Session = Depends(get_db)):
    return get_all_router_permissions_with_details(db)

@router.post("/bindings", response_model=RouterPermissionResponse, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(permission_required_root("menu:settings:router-permission", "create"))])
async def bind_router_permission(data: RouterPermissionCreate, db: Session = Depends(get_db)):
    return await create_router_permission(db, data)

@router.get("/bindings/{binding_id}", response_model=RouterPermissionResponse,
            dependencies=[Depends(permission_required_root("menu:settings:router-permission", "read"))])
def get_router_permission_binding(binding_id: int, db: Session = Depends(get_db)):
    return get_router_permission_by_id(db, binding_id)

@router.put("/bindings/{binding_id}", response_model=RouterPermissionResponse,
            dependencies=[Depends(permission_required_root("menu:settings:router-permission", "update"))])
async def update_router_permission_binding(binding_id: int, data: RouterPermissionUpdate, db: Session = Depends(get_db)):
    return await update_router_permission(db, binding_id, data)

@router.delete("/bindings/{binding_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(permission_required_root("menu:settings:router-permission", "delete"))])
async def delete_router_permission_binding(binding_id: int, db: Session = Depends(get_db)):
    await delete_router_permission(db, binding_id)

