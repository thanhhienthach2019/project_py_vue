from pydantic import BaseModel
from datetime import datetime

class UnitBase(BaseModel):
    Name: str

class UnitCreate(UnitBase):
    pass

class UnitUpdate(UnitBase):
    pass

class UnitResponse(UnitBase):
    UnitID: int
    CreatedAt: datetime

    class Config:
        from_attributes = True