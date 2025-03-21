from sqlalchemy import Integer, String, DateTime, Column, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class StockHistory(Base):
    __tablename__ = "StockHistory"

    StockHistoryID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    WarehouseID = Column(Integer, ForeignKey("Warehouses.WarehouseID"), nullable=False)
    MaterialID = Column(Integer, ForeignKey("Materials.MaterialID"), nullable=False)
    QuantityChange = Column(Integer, nullable=False)
    ChangeType = Column(String(50), nullable=False)
    ReferenceID = Column(Integer, nullable=False)
    ReferenceType = Column(String(50), nullable=False)
    ChangeDate = Column(DateTime, nullable=False, default=func.now())

    __table_args__ = (
        CheckConstraint("ChangeType IN ('Export','Import')", name="check_change_type"),
        CheckConstraint("ReferenceType IN ('MaintenanceRequest','ManualInput')", name="check_reference_type"),
    )