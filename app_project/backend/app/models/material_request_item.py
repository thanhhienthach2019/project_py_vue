from sqlalchemy import Column, Integer, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class MaterialRequestItem(Base):
    __tablename__ = "material_request_items"
    RequestItemID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    RequestID     = Column(Integer, ForeignKey("material_requests.RequestID", ondelete="CASCADE"), nullable=False)
    MaterialID    = Column(Integer, ForeignKey("Materials.MaterialID"), nullable=False)
    QuantityReq   = Column(Integer, nullable=False)
    QuantityOut   = Column(Integer, nullable=False, default=0)

    request  = relationship("MaterialRequest", back_populates="items")
    material = relationship("Material")

    __table_args__ = (
        CheckConstraint("QuantityReq > 0", name="chk_req_qty_positive"),
        CheckConstraint("QuantityOut >= 0", name="chk_req_out_non_negative"),
    )
