from fastapi import APIRouter, UploadFile, File, Form, status, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.auth.user import UserCreate, UserUpdate, UserResponse, UserDetail, ChangePassword
from app.schemas.generic_response import GenericResponse
from app.services.auth import user_service
from app.services.auth import profile_service
from app.core.permissions import permission_required
from app.core.auth import get_current_user_id
from app.utils.file import save_upload_file
from app.core.config import settings

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(permission_required())]
)

@router.get("")
def read_users(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    return user_service.list_users(db, skip, limit, is_active)

@router.post("")
async def create_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    phone_number: str = Form(None),
    image: UploadFile = File(None),
    remove_image: bool = Form(False),
    db: Session = Depends(get_db)
):
    profile_picture_url = None
    if image:
        profile_picture_url = await save_upload_file(image, str(settings.upload_path))
    elif remove_image:
        profile_picture_url = "" 
    create_data  = UserCreate(
                    username=username,
                    email=email,
                    password=password,
                    full_name=full_name,
                    phone_number=phone_number,
                    profile_picture=profile_picture_url
                )
    return await user_service.create_user(db, create_data )

@router.get("/{user_id}")
def read_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return user_service.get_user(db, user_id)

@router.put("/{user_id}")
async def update_user(
    user_id: int,
    email: str = Form(None),
    full_name: str = Form(None),
    phone_number: str = Form(None),
    password: str = Form(None),
    is_active: bool = Form(True),
    is_verified: bool = Form(False),
    remove_image: bool = Form(False), 
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    profile_picture: str | None = None
    if image is not None:
        save_path = settings.upload_path
        profile_picture = await save_upload_file(image, str(save_path))
    elif remove_image:
        profile_picture = ""
    
    update_data  = UserUpdate(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        password=password,
        is_active=is_active,
        is_verified=is_verified,
        profile_picture=profile_picture,
    )
    dto = UserUpdate(**update_data.model_dump(exclude_none=True))

    return await user_service.update_user(db, user_id, dto)

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return await user_service.delete_user(db, user_id)

@router.get("/me")
def get_my_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return user_service.get_user(db, user_id)

@router.put("/me")
async def update_my_profile(
    full_name: str = Form(None),
    phone_number: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    image_url = await save_upload_file(image, settings.UPLOAD_DIR)
    dto = UserUpdate(
        full_name=full_name,
        phone_number=phone_number,
        profile_picture=image_url
    )
    return await user_service.update_user(db, user_id, dto)

@router.put("/me/change-password")
async def change_my_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return await profile_service.change_my_password(db, user_id, data)
