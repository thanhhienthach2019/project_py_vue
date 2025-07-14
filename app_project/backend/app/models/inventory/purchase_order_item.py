from sqlalchemy import Column, Integer, ForeignKey, Numeric, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"
    POItemID        = Column(Integer, primary_key=True, autoincrement=True, index=True)
    PurchaseOrderID = Column(Integer, ForeignKey("purchase_orders.PurchaseOrderID", ondelete="CASCADE"), nullable=False)
    MaterialID      = Column(Integer, ForeignKey("Materials.MaterialID"), nullable=False)
    QuantityOrdered = Column(Integer, nullable=False)
    QuantityReceived= Column(Integer, nullable=False, default=0)
    UnitPrice       = Column(Numeric(18,4), nullable=False)

    order    = relationship("PurchaseOrder", back_populates="items")
    material = relationship("Material")

    __table_args__ = (
        CheckConstraint("QuantityOrdered > 0", name="chk_po_qty_positive"),
        CheckConstraint("QuantityReceived >= 0", name="chk_po_recv_non_negative"),
    )