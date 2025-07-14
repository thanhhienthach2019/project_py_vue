# app/schemas/menu/MenuItem.py

from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class MenuItemBase(BaseModel):
    title: str
    path: str
    icon: str
    permission_key: str
    parent_id: Optional[int] = None
    order: int

class MenuItemCreate(MenuItemBase):
    children: Optional[List["MenuItemCreate"]] = []  # Allow nested children
    model_config = ConfigDict(from_attributes=True)

class MenuItemUpdate(MenuItemBase):
    pass

class MenuItemResponse(MenuItemBase):
    id: int
    children: List["MenuItemResponse"] = []
    model_config = ConfigDict(from_attributes=True)

# For recursive models
MenuItemCreate.model_rebuild()
MenuItemResponse.model_rebuild()
