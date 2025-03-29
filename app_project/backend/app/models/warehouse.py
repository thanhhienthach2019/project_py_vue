from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Warehouses(Base):
    __tablename__ = "Warehouses"

    WarehouseID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    WarehouseCode = Column(String(20, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=False, unique=True)
    WarehouseName = Column(String(255, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=False)
    Location = Column(String(255, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    CreatedAt = Column(DateTime, nullable=False, default=func.now())
    