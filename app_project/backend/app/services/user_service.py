from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hash_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, hash_password=hash_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
