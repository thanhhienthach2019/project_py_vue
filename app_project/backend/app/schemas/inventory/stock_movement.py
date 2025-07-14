from pydantic import BaseModel
from datetime import datetime

class StockMovementBase(BaseModel):
    WarehouseID: int
    MaterialID: int
    QuantityChange: int
    MovementType: str  # "Import" or "Export"
    ReferenceID: int
    ReferenceType: str  # "PurchaseOrder", "MaterialRequest", ...

class StockMovementCreate(StockMovementBase):
    pass

class StockMovementResponse(StockMovementBase):
    StockMovementID: int
    ChangeDate: datetime

    class Config:
        from_attributes = True