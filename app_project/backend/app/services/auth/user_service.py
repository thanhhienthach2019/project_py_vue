from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from app.models.auth.user import User
from app.schemas.auth.user import UserCreate, UserUpdate, UserResponse
from passlib.context import CryptContext
from typing import List, Optional
from app.core.redis import publish_update

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_users(db: Session, skip: int = 0, limit: int = 100, is_active: bool = True) -> List[UserResponse]:
    return (
        db.query(User)
        .filter(User.is_active == is_active)
        .order_by(User.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_user_by_id(db: Session, user_id: int) -> Optional[UserResponse]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[UserResponse]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[UserResponse]:
    return db.query(User).filter(User.username == username).first()

async def create_user(db: Session, user: UserCreate) -> UserResponse:
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        full_name=user.full_name,
        phone_number=user.phone_number,
        profile_picture=user.profile_picture,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    await publish_update("create", "user", UserResponse.from_orm(db_user).model_dump())
    return db_user

async def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[UserResponse]:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None

    for field, value in user_update.model_dump(exclude_unset=True).items():
        if field == "password":
            if value:
                setattr(db_user, "hashed_password", pwd_context.hash(value))
        else:
            setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    await publish_update("update", "user", UserResponse.from_orm(db_user).model_dump())
    return db_user

async def delete_user(db: Session, user_id: int) -> bool:
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    db.delete(user)
    db.commit()
    await publish_update("delete", "user", UserResponse.from_orm(user).model_dump())
    return True
