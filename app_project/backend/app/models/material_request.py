from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MaterialRequest(Base):
    __tablename__ = "material_requests"
    RequestID   = Column(Integer, primary_key=True, autoincrement=True, index=True)
    UnitID      = Column(Integer, ForeignKey("units.UnitID"), nullable=False)
    RequestDate = Column(DateTime, nullable=False, default=func.now())
    Status      = Column(String(50), nullable=False, default="Pending")

    unit  = relationship("Unit")
    items = relationship("MaterialRequestItem", back_populates="request")