from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Unit(Base):
    __tablename__ = "units"
    UnitID     = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Name       = Column(String(200), nullable=False, unique=True)
    CreatedAt  = Column(DateTime, nullable=False, default=func.now())