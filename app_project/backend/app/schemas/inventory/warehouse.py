from pydantic import BaseModel
from datetime import datetime

class WarehouseBase(BaseModel):
    WarehouseName: str
    Location: str | None = None

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseUpdate(WarehouseBase):
    pass

class WarehouseResponse(WarehouseBase):
    WarehouseID: int
    CreatedAt: datetime

    class Config:
        from_attributes = True