from fastapi import APIRouter, UploadFile, File, Form,status, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service  
from app.core.permissions import permission_required_root
import os, datetime
from app.core.config import settings

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get(
    "/",
    response_model=List[UserResponse],
    dependencies=[Depends(permission_required_root("menu:settings:user", "read"))]
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
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(permission_required_root("menu:settings:user", "create"))]
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
    response_model=UserResponse,
    dependencies=[Depends(permission_required_root("menu:settings:user", "read"))]
)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(permission_required_root("menu:settings:user", "update"))]
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
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(permission_required_root("menu:settings:user", "delete"))]
)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = user_service.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return