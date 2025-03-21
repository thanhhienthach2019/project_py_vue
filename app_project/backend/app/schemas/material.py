from pydantic import BaseModel
from datetime import datetime

class MaterialBase(BaseModel):
    MaterialCode: str
    MaterialName: str
    ImageUrl: str | None = None
    Model: str | None = None
    Origin: str | None = None
    Unit: str | None = None
    Description: str | None = None

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(MaterialBase):
    pass

class MaterialResponse(MaterialBase):
    MaterialId: int
    CreatedAt: datetime

    class Config:
        from_attributes = True