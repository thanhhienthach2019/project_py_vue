from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.warehouse_service import (
    add_warehouse, update_warehouse, delete_warehouse, get_warehouse
)
from app.schemas.warehouse import WarehouseCreate, WarehouseUpdate
from app.core.middleware import custom_verify_token

router = APIRouter()

@router.get("get_warehouse")
def fetch_warehouse(db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    return get_warehouse(db)

@router.post("/add_warehouse")
def create_warehouse(warehouse: WarehouseCreate, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    return add_warehouse(db, warehouse)

@router.put("/update_warehouse/{warehouse_id}")
def modify_warehouse(warehouse_id: int, warehouse: WarehouseUpdate, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    up_warehouse = update_warehouse(db, warehouse_id, warehouse)
    if not up_warehouse:
        raise HTTPException(status_code=404, detail="Kho không tồn tại")
    return up_warehouse

@router.delete("/delete_warehouse/{warehouse_id}")
def remove_warehouse(warehouse_id: int, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    success = delete_warehouse(db, warehouse_id)
    if not success:
        raise HTTPException(status_code=404, detail="Kho không tồn tại")
    return {"message" : "Xoá kho thành công"}