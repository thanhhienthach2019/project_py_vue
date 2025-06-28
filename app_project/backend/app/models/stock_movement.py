from sqlalchemy import Column, Integer, DateTime, ForeignKey, CheckConstraint, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from .enums import MovementType, ReferenceType

class StockMovement(Base):
    __tablename__ = "stock_movements"
    StockMovementID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    WarehouseID     = Column(Integer, ForeignKey("Warehouses.WarehouseID"), nullable=False)
    MaterialID      = Column(Integer, ForeignKey("Materials.MaterialID"), nullable=False)
    QuantityChange  = Column(Integer, nullable=False)
    MovementType    = Column(Enum(MovementType), nullable=False)
    ReferenceID     = Column(Integer, nullable=False)
    ReferenceType   = Column(Enum(ReferenceType), nullable=False)
    ChangeDate      = Column(DateTime, nullable=False, default=func.now())

    __table_args__ = (
        CheckConstraint("QuantityChange <> 0", name="chk_qty_change_non_zero"),
    )

    warehouse = relationship("Warehouse")
    material  = relationship("Material")