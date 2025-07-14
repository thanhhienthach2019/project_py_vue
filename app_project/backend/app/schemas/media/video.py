from pydantic import BaseModel
from datetime import datetime

class VideoBase(BaseModel):
    title: str
    description: str | None = None
    youtube_url: str
    is_active: bool = True

class VideoCreate(VideoBase):
    thumbnail: bytes | None = None

class VideoUpdate(VideoBase):
    thumbnail: bytes | None = None

class VideoResponse(VideoBase):
    id: int
    published_at: datetime
    created_at: datetime
    updated_at: datetime
    thumbnail: bytes | None = None

    class Config:
        from_attributes = True
