from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class MachineBase(BaseModel):
    Name: str
    Type: Optional[str] = None
    Manufacturer: Optional[str] = None
    Model: Optional[str] = None
    SerialNumber: Optional[str] = None
    PurchaseDate: Optional[date] = None
    LastMaintenance: Optional[date] = None
    Status: Optional[bool] = True
    Location: Optional[str] = None
    Description: Optional[str] = None
    CreatedBy: Optional[str] = None

class MachineCreate(MachineBase):
    pass

class MachineUpdate(MachineBase):
    pass

class MachineResponse(MachineBase):
    MachineID: int
    CreateDate: datetime
    LastUpdate: datetime

    class Config:
        from_attributes = True
