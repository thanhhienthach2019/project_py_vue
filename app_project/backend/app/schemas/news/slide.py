from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import base64

class SlideBase(BaseModel):
    headline: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    order: int = 0
    is_active: bool = True

class SlideCreate(SlideBase):
    image: bytes

class SlideUpdate(SlideBase):
    image: Optional[bytes] = None

class SlideResponse(SlideBase):
    id: int
    created_at: datetime
    updated_at: datetime
    image_base64: Optional[str] = None  

    class Config:
        from_attributes = True

    @staticmethod
    def from_orm_with_base64(slide) -> "SlideResponse":
        image_data = bytes(slide.image) if slide.image else None  
        image_base64 = base64.b64encode(image_data).decode('utf-8') if image_data else None

        return SlideResponse(
            id=slide.id,
            headline=slide.headline,
            title=slide.title,
            description=slide.description,
            link=slide.link,
            order=slide.order,
            is_active=slide.is_active,
            created_at=slide.created_at,
            updated_at=slide.updated_at,
            image_base64=image_base64,
        )