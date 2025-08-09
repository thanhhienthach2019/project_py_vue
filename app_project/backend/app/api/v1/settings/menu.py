from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from fastapi import Request
from uuid import UUID
from app.core.database import get_db
from app.core.permissions import permission_required
from app.schemas.settings.MenuItem import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
)
from app.schemas.generic_response import GenericResponse
from app.services.settings.menu_service import (
    get_menu_tree_for_user,
    get_all_menu_items_response,
    create_menu_item,
    update_menu_item,
    delete_menu_item,
)

router = APIRouter(
    prefix="/menus",
    tags=["Menu"],
)

# --- GET: All menus (for admin) ---
@router.get("/all")
def get_all_menus(db: Session = Depends(get_db)):
    return get_all_menu_items_response(db)


@router.get("")
def get_user_menus(
    db: Session = Depends(get_db),
    payload: dict = Depends(permission_required),
):
    return get_menu_tree_for_user(db, payload.get("sub"))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_menu(
    data: MenuItemCreate,
    db: Session = Depends(get_db),
):
    return await create_menu_item(db, data)


@router.put("/{menu_id}")
async def update_menu(
    request: Request,
    menu_id: UUID,
    data: MenuItemUpdate,
    db: Session = Depends(get_db),
):
    return await update_menu_item(db, menu_id, data, request)


@router.delete("/{menu_id}")
async def delete_menu(
    request: Request,
    menu_id: UUID,
    db: Session = Depends(get_db),
):
    return await delete_menu_item(db, menu_id, request)