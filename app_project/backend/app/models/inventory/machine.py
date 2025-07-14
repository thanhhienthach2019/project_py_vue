from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean
from sqlalchemy.sql import func
from sqlalchemy.dialects.mssql import NVARCHAR
from app.core.database import Base

class Machine(Base):
    __tablename__ = 'machines'

    MachineID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(NVARCHAR(255), nullable=False)
    Type = Column(NVARCHAR(100), nullable=True)
    Manufacturer = Column(NVARCHAR(100), nullable=True)
    Model = Column(NVARCHAR(100), nullable=True)
    SerialNumber = Column(String(100), nullable=True)
    PurchaseDate = Column(Date, nullable=True)
    LastMaintenance = Column(Date, nullable=True)
    Status = Column(Boolean, default=True)
    Location = Column(NVARCHAR(255), nullable=True)  
    Description = Column(NVARCHAR(255), nullable=True) 
    CreatedBy = Column(NVARCHAR(100), nullable=True) 
    CreateDate = Column(DateTime, nullable=False, default=func.now())
    LastUpdate = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())