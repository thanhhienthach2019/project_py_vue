from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"
    SupplierID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Name       = Column(String(200), nullable=False, unique=True)
    Contact    = Column(String(200))
    CreatedAt  = Column(DateTime, nullable=False, default=func.now())