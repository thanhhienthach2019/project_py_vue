from pydantic import BaseModel
from decimal import Decimal

class PurchaseOrderItemBase(BaseModel):
    PurchaseOrderID: int
    MaterialID: int
    QuantityOrdered: int
    QuantityReceived: int = 0
    UnitPrice: Decimal

class PurchaseOrderItemCreate(PurchaseOrderItemBase):
    pass

class PurchaseOrderItemResponse(PurchaseOrderItemBase):
    POItemID: int

    class Config:
        from_attributes = True