from pydantic import BaseModel
from datetime import datetime

class StockHistoryBase(BaseModel):
    WarehouseID: int
    MaterialId: int
    QuantityChange: int
    ChangeType: str
    ReferenceID: int
    ReferenceType: str

class StockHistoryCreate(StockHistoryBase):
    pass

class StockHistoryResponse(StockHistoryBase):
    StockHistoryID: int
    ChangeDate: datetime

    class Config:
        from_attributes = True