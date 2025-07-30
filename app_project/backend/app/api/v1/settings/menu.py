from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.permissions import permission_required

from app.schemas.settings.MenuItem import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
)
from app.services.settings.menu_service import (
    get_menu_tree_for_user,
    create_menu_item,
    update_menu_item,
    delete_menu_item,
    get_all_menu_items_response
)

router = APIRouter(
    prefix="/menus",
    tags=["Menu"],
    dependencies=[Depends(permission_required())]  
)

@router.get(
    "/all",
    response_model=List[MenuItemResponse]
)
def get_all_menus(
    db: Session = Depends(get_db)
):
    return get_all_menu_items_response(db)

# --- GET: Retrieve the menu tree for the current user ---
@router.get(
    "",
    response_model=List[MenuItemResponse]
)
def get_user_menus(
    db: Session = Depends(get_db),
    payload: dict = [Depends(permission_required)]
):   
    username = payload.get("sub")
    return get_menu_tree_for_user(db, username)

# --- POST: Create a new menu item ---
@router.post(
    "",
    response_model=MenuItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_menu(
    data: MenuItemCreate,
    db: Session = Depends(get_db)
):
    return await create_menu_item(db, data)

# --- PUT: Update an existing menu item by ID ---
@router.put(
    "/{menu_id}",
    response_model=MenuItemResponse
)
async def update_menu(
    menu_id: int,
    data: MenuItemUpdate,
    db: Session = Depends(get_db)
):
    return await update_menu_item(db, menu_id, data)

# --- DELETE: Delete a menu item by ID ---
@router.delete(
    "/{menu_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_menu(
    menu_id: int,
    db: Session = Depends(get_db)
):
    await delete_menu_item(db, menu_id)
