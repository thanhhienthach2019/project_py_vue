from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.mssql import NVARCHAR
from sqlalchemy.sql import func
from app.core.database import Base

class Materials(Base):
    __tablename__ = "Materials"

    MaterialID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaterialCode = Column(String(50), unique=True, nullable=False)
    MaterialName = Column(NVARCHAR(255), nullable=False)  
    ImageUrl = Column(String(500), nullable=True)
    Model = Column(NVARCHAR(100), nullable=True) 
    Origin = Column(NVARCHAR(100), nullable=True) 
    Unit = Column(NVARCHAR(50), nullable=True)  
    Description = Column(NVARCHAR(500), nullable=True)  
    CreatedAt = Column(DateTime, nullable=False, default=func.now())
    