from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.permissions import permission_required
from app.services.inventory.inventory_service import (
    add_product, update_product, delete_product,
    import_stock, export_stock, get_stock_history
)
from app.schemas.inventory.inventory import InventoryCreate, InventoryUpdate

router = APIRouter(
    prefix="/products",
    tags=["Inventory"],
    dependencies=[Depends(permission_required())]
)

# Create a product
@router.post("", summary="Create a new product")
def create_product(
    product: InventoryCreate,
    db: Session = Depends(get_db)
):
    return add_product(db, product)

# Update a product
@router.put("/{product_id}", summary="Update a product")
def update_product_by_id(
    product_id: int,
    product: InventoryUpdate,
    db: Session = Depends(get_db)
):
    result = update_product(db, product_id, product)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found.")
    return result

# Delete a product
@router.delete("/{product_id}", summary="Delete a product")
def delete_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    success = delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"message": "Product deleted successfully."}

# Import stock into warehouse
@router.post("/import", summary="Import stock to warehouse")
def import_inventory_stock(
    warehouse_id: int = Query(..., description="Warehouse ID"),
    material_id: int = Query(..., description="Material ID"),
    quantity: int = Query(..., description="Quantity to import"),
    db: Session = Depends(get_db)
):
    return import_stock(db, warehouse_id, material_id, quantity)

# Export stock from warehouse
@router.post("/export", summary="Export stock from warehouse")
def export_inventory_stock(
    warehouse_id: int = Query(..., description="Warehouse ID"),
    material_id: int = Query(..., description="Material ID"),
    quantity: int = Query(..., description="Quantity to export"),
    db: Session = Depends(get_db)
):
    result = export_stock(db, warehouse_id, material_id, quantity)
    if not result:
        raise HTTPException(status_code=400, detail="Insufficient stock for export.")
    return result

# Get stock history
@router.get("/history", summary="Get stock transaction history")
def get_inventory_history(
    db: Session = Depends(get_db)
):
    return get_stock_history(db)
