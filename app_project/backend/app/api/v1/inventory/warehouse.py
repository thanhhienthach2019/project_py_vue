from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import permission_required
from app.services.inventory.warehouse_service import (
    add_warehouse,
    update_warehouse,
    delete_warehouse,
    get_warehouse,
)
from app.schemas.inventory.warehouse import WarehouseCreate, WarehouseUpdate

router = APIRouter(
    prefix="/warehouses",
    tags=["Warehouses"],
    dependencies=[Depends(permission_required())]  
)

@router.get("")
def list_warehouses(db: Session = Depends(get_db)):
    """
    Get list of warehouses.
    """
    return get_warehouse(db)

@router.post("")
def create_warehouse(
    warehouse: WarehouseCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new warehouse.
    """
    return add_warehouse(db, warehouse)

@router.put("/{warehouse_id}")
def update_warehouse_info(
    warehouse_id: int,
    warehouse: WarehouseUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a warehouse by ID.
    """
    updated = update_warehouse(db, warehouse_id, warehouse)
    if not updated:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return updated

@router.delete("/{warehouse_id}")
def delete_warehouse_info(
    warehouse_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a warehouse by ID.
    """
    success = delete_warehouse(db, warehouse_id)
    if not success:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return {"message": "Warehouse deleted successfully"}
