from pydantic import BaseModel
from datetime import datetime

class AnnouncementBase(BaseModel):
    title: str
    message: str
    announcement_date: datetime

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(AnnouncementBase):
    pass

class AnnouncementResponse(AnnouncementBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
