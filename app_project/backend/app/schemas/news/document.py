from pydantic import BaseModel
from datetime import datetime

class DocumentCategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None

class DocumentCategoryCreate(DocumentCategoryBase):
    icon: bytes | None = None

class DocumentCategoryUpdate(DocumentCategoryBase):
    icon: bytes | None = None

class DocumentCategoryResponse(DocumentCategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    icon: bytes | None = None

    class Config:
        from_attributes = True


class DocumentBase(BaseModel):
    title: str
    description: str | None = None
    file_url: str | None = None
    content: str | None = None

class DocumentCreate(DocumentBase):
    category_id: int
    image: bytes | None = None

class DocumentUpdate(DocumentBase):
    category_id: int | None = None
    image: bytes | None = None

class DocumentResponse(DocumentBase):
    id: int
    category_id: int
    created_at: datetime
    updated_at: datetime
    image: bytes | None = None

    class Config:
        from_attributes = True
