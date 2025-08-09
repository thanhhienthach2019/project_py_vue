from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.services.auth import profile_service
from app.services.auth.dependencies import get_current_user_id_from_cookie
from app.schemas.auth.user import MyProfileUpdate, ChangePassword
from app.schemas.generic_response import GenericResponse
from app.schemas.auth.user import UserResponse
from app.utils.file import save_upload_file
from app.core.config import settings

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("", response_model=GenericResponse[UserResponse])
def get_profile(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id_from_cookie)
):
    return profile_service.get_my_profile(db, user_id)


@router.put("", response_model=GenericResponse[UserResponse])
async def update_profile(
    full_name: str = Form(None),
    email: str = Form(None),
    phone_number: str = Form(None),
    remove_image: bool = Form(False),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id_from_cookie)
):
    profile_picture = None

    if image:
        profile_picture = await save_upload_file(image, settings.upload_path)
    elif remove_image:
        profile_picture = ""

    data = MyProfileUpdate(
        full_name=full_name,
        email=email,
        phone_number=phone_number,
        profile_picture=profile_picture
    )
    return await profile_service.update_my_profile(db, user_id, data)


@router.put("/change-password", response_model=GenericResponse[None])
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id_from_cookie)
):
    return profile_service.change_my_password(db, user_id, data)
