from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.auth.user import User
from app.schemas.auth.user import MyProfileUpdate, ChangePassword
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_my_profile(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def update_my_profile(db: Session, user_id: int, profile_data: MyProfileUpdate) -> User:
    user = get_my_profile(db, user_id)
    update_data = profile_data.model_dump(exclude_unset=True)
    allowed_fields = ["email", "full_name", "phone_number", "profile_picture"]

    for field in allowed_fields:
        if field in update_data:
            setattr(user, field, update_data[field])

    db.commit()
    db.refresh(user)
    return user

def change_my_password(db: Session, user_id: int, data: ChangePassword) -> bool:
    user = get_my_profile(db, user_id)

    if not pwd_context.verify(data.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    user.hashed_password = pwd_context.hash(data.new_password)
    db.commit()
    return True
