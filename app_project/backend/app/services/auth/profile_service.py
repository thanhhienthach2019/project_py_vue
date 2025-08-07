from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from passlib.context import CryptContext
from app.models.auth.user import User
from app.schemas.auth.user import MyProfileUpdate, ChangePassword, UserResponse
from app.schemas.generic_response import GenericResponse
from app.core.http_exceptions import http_400, http_404, http_500
from app.core.redis import publish_update

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_my_profile_model(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise http_404("error.user.not_found")
    return user


def get_my_profile(db: Session, user_id: int) -> GenericResponse[UserResponse]:
    user = get_my_profile_model(db, user_id)
    return GenericResponse(
        data=UserResponse.from_orm(user),
        message="notification.fetch.success",
        args={"entity": "User"}
    )


async def update_my_profile(db: Session, user_id: int, profile_data: MyProfileUpdate) -> GenericResponse[UserResponse]:
    user = get_my_profile_model(db, user_id)
    try:
        update_data = profile_data.model_dump(exclude_unset=True)
        allowed_fields = ["email", "full_name", "phone_number", "profile_picture"]

        for field in allowed_fields:
            if field in update_data:
                setattr(user, field, update_data[field])

        db.commit()
        db.refresh(user)
        await publish_update("update", "user", UserResponse.from_orm(user).model_dump())
        return GenericResponse(
            data=UserResponse.from_orm(user),
            message="notification.update.success",
            args={"entity": "User"}
        )
    except SQLAlchemyError:
        db.rollback()
        raise http_500("error.user.update_failed")


def change_my_password(db: Session, user_id: int, data: ChangePassword) -> GenericResponse[None]:
    user = get_my_profile_model(db, user_id)

    if not pwd_context.verify(data.old_password, user.hashed_password):
        raise http_400("error.user.invalid_old_password")

    try:
        user.hashed_password = pwd_context.hash(data.new_password)
        db.commit()

        return GenericResponse(
            data=None,
            message="notification.change_password.success",
            args={"entity": "User"}
        )
    except SQLAlchemyError:
        db.rollback()
        raise http_500("error.user.change_password_failed")
