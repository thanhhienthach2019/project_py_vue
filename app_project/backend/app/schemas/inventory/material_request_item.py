from pydantic import BaseModel

class MaterialRequestItemBase(BaseModel):
    RequestID: int
    MaterialID: int
    QuantityReq: int
    QuantityOut: int = 0

class MaterialRequestItemCreate(MaterialRequestItemBase):
    pass

class MaterialRequestItemResponse(MaterialRequestItemBase):
    RequestItemID: int

    class Config:
        from_attributes = True