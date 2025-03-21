from sqlalchemy import Column, Integer, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class Inventory(Base):
    __tablename__ = "Inventory"

    InventoryID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    WarehouseID = Column(Integer, ForeignKey("Warehouses.WarehouseID"), nullable=False)
    MaterialID = Column(Integer, ForeignKey("Materials.MaterialID"), nullable=False)
    Quantity = Column(Integer, nullable=False, default=0)
    LastUpdated = Column(DateTime, nullable=False, default=func.now())

    __table_args__ = (
        CheckConstraint('Quantity > 0', name='chk_quantity_non_negative'),
    )