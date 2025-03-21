from sqlalchemy.orm import Session
from app.models.warehouse import Warehouses
from app.schemas.warehouse import WarehouseCreate, WarehouseUpdate, WarehouseResponse

def get_warehouse(db: Session):
    return db.query(Warehouses).all()

def add_warehouse(db: Session, warehouse_data: WarehouseCreate):
    new_warehouse = Warehouses(
        WarehouseName = warehouse_data.WarehouseName,
        Location = warehouse_data.Location
    )

    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

def update_warehouse(db: Session, warehouse_id: int, warehouse_data: WarehouseUpdate):
    warehouse = db.query(Warehouses).filter(Warehouses.WarehouseID == warehouse_id).first()
    if not warehouse:
        raise ValueError(f"Warehouse với ID {warehouse_id} không tồn tại")
    
    warehouse.WarehouseName = warehouse_data.WarehouseName
    warehouse.Location = warehouse_data.Location

    db.commit()
    db.refresh(warehouse)
    return warehouse

def delete_warehouse(db: Session, warehouse_id: int):
    warehouse = db.query(Warehouses).filter(Warehouses.WarehouseID == warehouse_id)
    if not warehouse:
        raise ValueError(f"Warehouse với ID {warehouse_id} không tồn tại")
    
    db.delete(warehouse)
    db.commit()
    return True
    
    