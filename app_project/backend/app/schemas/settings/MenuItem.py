from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class MenuItemBase(BaseModel):
    title: str
    path: str
    icon: str
    permission_key: str
    parent_id: Optional[int] = None
    order: int

class MenuItemCreate(MenuItemBase):
    children: Optional[List["MenuItemCreate"]] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

class MenuItemUpdate(MenuItemBase):
    pass

class MenuItemResponse(MenuItemBase):
    id: int
    children: Optional[List["MenuItemResponse"]] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

# Rebuild for recursive
MenuItemCreate.model_rebuild()
MenuItemResponse.model_rebuild()
