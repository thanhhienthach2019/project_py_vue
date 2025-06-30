from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# Base - dùng chung cho Create/Update
class UserBase(BaseModel):
    username: str = Field(..., max_length=50)
    email: EmailStr
    role: str = Field(default="user", description="Role of the user, e.g., admin, user, etc.")
    full_name: Optional[str] = Field(None, max_length=255)
    phone_number: Optional[str] = Field(None, max_length=20)
    profile_picture: Optional[str] = Field(None, max_length=500)


# Create - thêm mới
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)


# Update - cập nhật thông tin
class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    full_name: Optional[str]
    phone_number: Optional[str]
    profile_picture: Optional[str]
    is_active: Optional[bool]
    role: Optional[str]
    is_verified: Optional[bool]
    password: Optional[str] = Field(None, min_length=6)

    class Config:
        from_attributes = True


# Response - phản hồi đơn giản (list user)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True


# Detail - phản hồi đầy đủ
class UserDetail(UserResponse):
    full_name: Optional[str]
    phone_number: Optional[str]
    profile_picture: Optional[str]
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]
    is_verified: bool

    class Config:
        from_attributes = True

class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)