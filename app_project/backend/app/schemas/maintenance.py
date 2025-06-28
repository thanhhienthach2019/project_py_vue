from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MaintenanceRequestDetailBase(BaseModel):
    RequestID: int
    MaterialID: int
    WarehouseID: int
    QuantityUsed: int

class MaintenanceRequestBase(BaseModel):
    RequestNumber: str
    MachineName: str
    Diagnosis: str | None = None
    RequestedBy: str | None = None
    Status: str = "Pending"

class MaintenanceRequestCreate(MaintenanceRequestBase):
    Details: List[MaintenanceRequestDetailBase]

class MaintenanceRequestDetailResponse(MaintenanceRequestDetailBase):
    RequestDetailID: int
    RequestID: int  

    class Config:
        from_attributes = True

class MaintenanceRequestResponse(MaintenanceRequestBase):
    RequestID: int
    RequestDate: datetime
    CreatedAt: datetime
    Details: List[MaintenanceRequestDetailBase]

    class Config:
        from_attributes = True

class MaintenanceRequestDetailUpdate(BaseModel):
    MaterialID: Optional[int] = None
    WarehouseID: Optional[int] = None
    QuantityUsed: Optional[int] = None

class MaintenanceRequestUpdate(BaseModel):
    MachineName: Optional[str] = None
    Diagnosis: Optional[str] = None
    RequestedBy: Optional[str] = None
    Details: Optional[List[MaintenanceRequestDetailUpdate]] = None