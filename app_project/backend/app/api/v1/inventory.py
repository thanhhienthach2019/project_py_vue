from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.inventory_service import (
    add_product, update_product, delete_product,
    import_stock, export_stock, get_stock_history
)
from app.schemas.inventory import InventoryCreate, InventoryUpdate
from app.core.middleware import custom_verify_token

router = APIRouter()

@router.post("/add_product")
def create_product(
    product: InventoryCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    return add_product(db, product)

@router.put("/update_product/{product_id}")
def modify_product(
    product_id: int,
    product: InventoryUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    up_product = update_product(db, product_id, product)
    if not up_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return up_product

@router.delete("/delete_product/{product_id}")
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    success = delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.post("/import_stock")
def import_inventory(
    warehouse_id: int,
    material_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    return import_stock(db, warehouse_id, material_id, quantity)

@router.post("/export_product")
def export_inventory(
    warehouse_id: int,
    material_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    result = export_stock(db, warehouse_id, material_id, quantity)
    if not result:
        raise HTTPException(status_code=404, detail="Not enough stock to export")
    return result

@router.get("/stock_history")
def fetch_stock_history(
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    return get_stock_history(db)
