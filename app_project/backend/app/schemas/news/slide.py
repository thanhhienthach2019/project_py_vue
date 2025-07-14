from pydantic import BaseModel
from datetime import datetime

class SlideBase(BaseModel):
    title: str | None = None
    link: str | None = None
    order: int = 0
    is_active: bool = True

class SlideCreate(SlideBase):
    image: bytes 

class SlideUpdate(SlideBase):
    image: bytes | None = None

class SlideResponse(SlideBase):
    id: int
    created_at: datetime
    updated_at: datetime
    image: bytes | None = None

    class Config:
        from_attributes = True
