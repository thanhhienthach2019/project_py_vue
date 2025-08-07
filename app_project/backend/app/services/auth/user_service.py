from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.auth.user import User
from app.schemas.auth.user import UserCreate, UserUpdate, UserResponse
from passlib.context import CryptContext
from typing import List
from app.core.redis import publish_update
from app.core.http_exceptions import http_400, http_404, http_500
from app.schemas.generic_response import GenericResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def list_users(db: Session, skip: int, limit: int, is_active: bool) -> GenericResponse[List[UserResponse]]:
    try:
        users = (
            db.query(User)
            .filter(User.is_active == is_active)
            .order_by(User.id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return GenericResponse(
            data=[UserResponse.from_orm(u) for u in users],
            message="notification.fetch.success",
            args={"entity": "User"}
        )
    except Exception:
        raise http_500("error.user.fetch_failed")


def get_user_model(db: Session, user_id: int) -> User:
    user = db.query(User).get(user_id)
    if not user:
        raise http_404("error.user.not_found")
    return user


def get_user(db: Session, user_id: int) -> GenericResponse[UserResponse]:
    user = get_user_model(db, user_id)
    return GenericResponse(
        data=UserResponse.from_orm(user),
        message="notification.fetch.success",
        args={"entity": "User"}
    )


async def create_user(db: Session, data: UserCreate) -> GenericResponse[UserResponse]:
    # Check duplicates
    if db.query(User).filter(User.email == data.email).first():
        raise http_400("error.user.duplicate_email")
    if db.query(User).filter(User.username == data.username).first():
        raise http_400("error.user.duplicate_username")

    try:
        hashed = pwd_context.hash(data.password)
        user = User(
            username=data.username,
            email=data.email,
            hashed_password=hashed,
            full_name=data.full_name,
            phone_number=data.phone_number,
            profile_picture=data.profile_picture or None  
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)

        await publish_update("create", "user", UserResponse.from_orm(user).model_dump())
        return GenericResponse(
            data=UserResponse.from_orm(user),
            message="notification.create.success",
            args={"entity": "User"}
        )
    except IntegrityError:
        db.rollback()
        raise http_400("error.user.create_failed")
    except Exception:
        db.rollback()
        raise http_500("error.user.create_failed")



async def update_user(db: Session, user_id: int, data: UserUpdate) -> GenericResponse[UserResponse]:
    user = get_user_model(db, user_id)
    try:
        payload = data.model_dump(exclude_unset=True)
        if "password" in payload:
            payload["hashed_password"] = pwd_context.hash(payload.pop("password"))
        if "profile_picture" in payload:
            profile_picture_value = payload.pop("profile_picture")
            if profile_picture_value == "": 
                user.profile_picture = None
            elif profile_picture_value:      
                user.profile_picture = profile_picture_value

        for k, v in payload.items():
            setattr(user, k, v)

        db.commit()
        db.refresh(user)
        await publish_update("update", "user", UserResponse.from_orm(user).model_dump())
        return GenericResponse(
            data=UserResponse.from_orm(user),
            message="notification.update.success",
            args={"entity": "User"}
        )
    except Exception:
        db.rollback()
        raise http_500("error.user.update_failed")


async def delete_user(db: Session, user_id: int) -> GenericResponse[None]:
    user = get_user_model(db, user_id)
    try:
        db.delete(user)
        db.commit()
        await publish_update("delete", "user", UserResponse.from_orm(user).model_dump())
        return GenericResponse(
            data=None,
            message="notification.delete.success",
            args={"entity": "User"}
        )
    except Exception:
        db.rollback()
        raise http_500("error.user.delete_failed")
