from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID

class MenuItemBase(BaseModel):
    title: str
    path: str
    icon: Optional[str] = None
    permission_key: str
    parent_id: Optional[UUID] = None
    version: int
    order: int

class MenuItemCreate(MenuItemBase):
    children: Optional[List["MenuItemCreate"]] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

class MenuItemUpdate(MenuItemBase):
    model_config = ConfigDict(from_attributes=True)

class MenuItemResponse(MenuItemBase):
    id: UUID
    children: Optional[List["MenuItemResponse"]] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

# Rebuild for recursive
MenuItemCreate.model_rebuild()
MenuItemResponse.model_rebuild()
