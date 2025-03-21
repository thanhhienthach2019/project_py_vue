from sqlalchemy.orm import Session
from datetime import datetime
from app.models.inventory import Inventory
from app.models.stock_history import StockHistory
from app.schemas.inventory import InventoryCreate, InventoryUpdate

def add_product(db: Session, product_data: InventoryCreate):
    new_product = Inventory(
        WarehouseID=product_data.WarehouseId,
        MaterialID=product_data.MaterialID,
        Quantity=product_data.Quantity,
        LastUpdated=datetime.utcnow()
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

def update_product(db: Session, product_id: int, product_data: InventoryUpdate):
    product = db.query(Inventory).filter(Inventory.InventoryID == product_id).first()
    if product:
        product.Quantity = product_data.Quantity
        product.LastUpdated = datetime.utcnow()
        db.commit()
        db.refresh(product)
        return product
    return None

def delete_product(db: Session, product_id: int):
    product = db.query(Inventory).filter(Inventory.InventoryID == product_id)
    if product:
        db.delete(product)
        db.commit()
        return True
    return False

def import_stock(db: Session, warehouse_id: int, material_id: int, quantity: int):
    inventory = db.query(Inventory).filter(
        Inventory.WarehouseID == warehouse_id,
        Inventory.MaterialID == material_id
    ).first()

    if inventory:
        inventory.Quantity += quantity
        inventory.LastUpdated = datetime.utcnow()
    else:
        inventory = Inventory(
            WarehouseID = warehouse_id,
            MaterialID = material_id,
            Quantity = quantity,
            LastUpdated = datetime.utcnow()
        )
        db.add(inventory)
    
    stock_history = StockHistory(
        WarehouseID = warehouse_id,
        MaterialID = material_id,
        QuantityChange = quantity,
        ChangeType = "Import",
        ReferenceID = 0,
        ReferenceType = "ManualInput",
        ChangeDate = datetime.utcnow()
    )

    db.add(stock_history)
    db.commit()
    db.refresh(inventory)
    return inventory

def export_stock(db: Session, warehouse_id: int, material_id: int, quantity: int):
    inventory = db.query(Inventory).filter(
        Inventory.WarehouseID == warehouse_id,
        Inventory.MaterialID == material_id
    ).first()

    if not inventory or inventory.Quantity < quantity:
        return None #không đủ hàng để xuất
    
    inventory.Quantity -= quantity
    inventory.LastUpdated = datetime.utcnow()

    stock_history = StockHistory(
        WarehouseID = warehouse_id,
        MaterialID = material_id,
        QuantityChange =- quantity,
        ChangeType = "Export",
        ReferenceID = 0,
        ReferenceType = "MaintenanceRequest",
        ChangeDate = datetime.utcnow()
    )

    db.add(stock_history)
    db.commit()
    db.refresh(inventory)
    return inventory

def get_stock_history(db: Session):
    return db.query(StockHistory).all()
