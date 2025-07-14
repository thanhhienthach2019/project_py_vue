from pydantic import BaseModel
from datetime import datetime
from typing import List
from .material_request_item import MaterialRequestItemResponse, MaterialRequestItemBase

class MaterialRequestBase(BaseModel):
    UnitID: int
    Status: str = "Pending"

class MaterialRequestCreate(MaterialRequestBase):
    Details: List[MaterialRequestItemBase]

class MaterialRequestResponse(MaterialRequestBase):
    RequestID: int
    RequestDate: datetime
    Details: List[MaterialRequestItemResponse]

    class Config:
        from_attributes = True
