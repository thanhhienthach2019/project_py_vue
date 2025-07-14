from fastapi import APIRouter, UploadFile, File, Form,status, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.auth.user import UserCreate, UserUpdate, UserResponse, MyProfileUpdate, ChangePassword, UserDetail
from app.services.auth import user_service  
from app.services.auth import profileService
from app.core.permissions import permission_required 
from app.core.auth import get_current_user_id
import os, datetime
from app.core.config import settings

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(permission_required())]
)

@router.get(
    "/",
    response_model=List[UserResponse]
)
def read_users(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    return user_service.get_users(db, skip=skip, limit=limit, is_active=is_active)

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    phone_number: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Check email exists
    existing_user = user_service.get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Handle image upload
    image_url = None
    if image:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Invalid image filename")

        ext = os.path.splitext(image.filename)[1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid image format")

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
        safe_filename = f"{timestamp}_{image.filename.replace('/', '_').replace('\\', '_')}"
        upload_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        with open(upload_path, "wb") as f:
            f.write(image.file.read())

        image_url = safe_filename

    # Build UserCreate object
    user_data = UserCreate(
        username=username,
        email=email,
        password=password,
        full_name=full_name,
        phone_number=phone_number,
        profile_picture=image_url
    )

    return user_service.create_user(db, user_data)

@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put(
    "/{user_id}",
    response_model=UserResponse
)
def update_user(
    user_id: int,
    email: str = Form(None),
    full_name: str = Form(None),
    phone_number: str = Form(None),
    password: str = Form(None),
    is_active: bool = Form(True),
    is_verified: bool = Form(False),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    existing_user = user_service.get_user_by_id(db, user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    image_url = existing_user.profile_picture  
    if image:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Invalid image filename")
        
        ext = os.path.splitext(image.filename)[1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid image format")

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
        safe_filename = f"{timestamp}_{image.filename.replace('/', '_').replace('\\', '_')}"
        upload_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        with open(upload_path, "wb") as f:
            f.write(image.file.read())

        image_url = safe_filename

    user_update = UserUpdate(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        password=password,
        is_active=is_active,
        is_verified=is_verified,
        profile_picture=image_url
    )

    updated_user = user_service.update_user(db, user_id, user_update)
    return updated_user

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = user_service.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return

@router.get(
    "/me",
    response_model=UserDetail
)
def get_my_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return profileService.get_my_profile(db, user_id)

@router.put(
    "/me",
    response_model=UserDetail
)
def update_my_profile(
    email: str = Form(None),
    full_name: str = Form(None),
    phone_number: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    existing_user = profileService.get_my_profile(db, user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    image_url = existing_user.profile_picture
    if image:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Invalid image filename")

        ext = os.path.splitext(image.filename)[1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid image format")

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
        safe_filename = f"{timestamp}_{image.filename.replace('/', '_').replace('\\', '_')}"
        upload_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        with open(upload_path, "wb") as f:
            f.write(image.file.read())

        image_url = safe_filename

    profile_data = MyProfileUpdate(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        profile_picture=image_url
    )

    return profileService.update_my_profile(db, user_id, profile_data)

@router.put(
    "/me/change-password"
)
def change_my_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    profileService.change_my_password(db, user_id, data)
    return {"message": "Password changed successfully"}