from pydantic import BaseModel
from datetime import datetime

class FestivalBase(BaseModel):
    name: str
    description: str | None = None
    start_date: datetime
    end_date: datetime | None = None
    location: str | None = None
    is_active: bool = True

class FestivalCreate(FestivalBase):
    image: bytes | None = None

class FestivalUpdate(FestivalBase):
    image: bytes | None = None

class FestivalResponse(FestivalBase):
    id: int
    created_at: datetime
    updated_at: datetime
    image: bytes | None = None

    class Config:
        from_attributes = True
