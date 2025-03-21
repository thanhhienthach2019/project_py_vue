from datetime import timedelta
from fastapi import HTTPException, Response
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.core.config import settings

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return user

def set_access_token_cookie(response: Response, user: User):
    try:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

        response.set_cookie(
            key="token",
            value=access_token,
            httponly=True,  # Ngăn chặn JavaScript truy cập (chống XSS)
            secure=True,    # Bật trên HTTPS
            samesite="Strict",  # Chặn gửi cookie khi request từ site khác
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        return {"message": "Login successful"}
    
    except Exception as e:
        print(f"🚨 Error setting token cookie: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    