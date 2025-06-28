from pydantic import BaseModel
from datetime import datetime

class SupplierBase(BaseModel):
    Name: str
    Contact: str | None = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    SupplierID: int
    CreatedAt: datetime

    class Config:
        from_attributes = True