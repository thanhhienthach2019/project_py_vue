from pydantic import BaseModel
from datetime import datetime

class NewsCategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None

class NewsCategoryCreate(NewsCategoryBase):
    pass

class NewsCategoryUpdate(NewsCategoryBase):
    pass

class NewsCategoryResponse(NewsCategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NewsArticleBase(BaseModel):
    title: str
    slug: str
    summary: str | None = None
    content: str
    is_published: bool = False

class NewsArticleCreate(NewsArticleBase):
    category_id: int
    image: bytes | None = None

class NewsArticleUpdate(NewsArticleBase):
    category_id: int | None = None
    image: bytes | None = None

class NewsArticleResponse(NewsArticleBase):
    id: int
    category_id: int
    published_at: datetime
    created_at: datetime
    updated_at: datetime
    image: bytes | None = None

    class Config:
        from_attributes = True
