from pydantic import BaseModel, Field
from datetime import datetime

class InventoryBase(BaseModel):
    WarehouseId: int
    MaterialID: int
    Quantity: int = Field(ge=0)

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(InventoryBase):
    pass

class InventoryResponse(InventoryBase):
    InventoryID: int
    LastUpdated: datetime

    class Config:
        from_attributes = True