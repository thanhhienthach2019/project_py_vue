from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

# ===== Base Schema =====
class UserBase(BaseModel):
    username: str = Field(..., max_length=50)
    email: EmailStr
    role: Optional[str] = Field(None, max_length=20)
    full_name: Optional[str] = Field(None, max_length=255)
    phone_number: Optional[str] = Field(None, max_length=20)
    profile_picture: Optional[str] = None


# ===== Create User =====
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)


# ===== Update User =====
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None  
    is_active: Optional[bool] = None
    role: Optional[str] = None
    is_verified: Optional[bool] = None
    password: Optional[str] = Field(default=None, min_length=6)
    version: int  # required for optimistic concurrency

    class Config:
        from_attributes = True


# ===== Response Schema =====
class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    full_name: Optional[str]
    phone_number: Optional[str]
    profile_picture: Optional[str]
    is_active: bool
    is_verified: bool
    role: Optional[str]  
    last_login: Optional[datetime]
    version: int

    class Config:
        from_attributes = True


# ===== Detailed Response =====
class UserDetail(UserResponse):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===== Change Password Schema =====
class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)


# ===== Profile Update Schema =====
class MyProfileUpdate(BaseModel):
    email: Optional[EmailStr]
    full_name: Optional[str]
    phone_number: Optional[str]
    profile_picture: Optional[str]

    class Config:
        from_attributes = True


# ===== Language Update Schema =====
class UpdateLanguageRequest(BaseModel):
    lang: str
