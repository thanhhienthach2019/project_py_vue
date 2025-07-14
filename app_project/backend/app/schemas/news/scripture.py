from pydantic import BaseModel
from datetime import datetime

class ScriptureCategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None

class ScriptureCategoryCreate(ScriptureCategoryBase):
    pass

class ScriptureCategoryUpdate(ScriptureCategoryBase):
    pass

class ScriptureCategoryResponse(ScriptureCategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ScriptureBase(BaseModel):
    title: str
    author: str | None = None
    content: str | None = None
    pdf_url: str | None = None

class ScriptureCreate(ScriptureBase):
    category_id: int

class ScriptureUpdate(ScriptureBase):
    category_id: int | None = None

class ScriptureResponse(ScriptureBase):
    id: int
    category_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
