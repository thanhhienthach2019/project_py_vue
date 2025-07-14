from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    PurchaseOrderID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    SupplierID      = Column(Integer, ForeignKey("suppliers.SupplierID"), nullable=False)
    OrderDate       = Column(DateTime, nullable=False, default=func.now())
    Status          = Column(String(50), nullable=False, default="Pending")

    supplier = relationship("Supplier")
    items    = relationship("PurchaseOrderItem", back_populates="order")