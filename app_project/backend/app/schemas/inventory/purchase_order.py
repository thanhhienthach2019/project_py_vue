from pydantic import BaseModel
from datetime import datetime
from typing import List
from .purchase_order_item import PurchaseOrderItemResponse

class PurchaseOrderBase(BaseModel):
    SupplierID: int
    Status: str = "Pending"

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrderResponse(PurchaseOrderBase):
    PurchaseOrderID: int
    OrderDate: datetime
    items: List[PurchaseOrderItemResponse] = []

    class Config:
        from_attributes = True