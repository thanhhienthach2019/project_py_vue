import os
from datetime import timedelta
from fastapi import HTTPException, Response, Request
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, create_access_token, decode_access_token
from app.core.config import settings

def login_user(db: Session, username: str, password: str, response: Response):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    refresh_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(days=7))  
    
    is_prod = os.getenv("ENV", "DEV").upper() == "PROD"
    
    response.set_cookie(
        key="_aid-atk_",
        value=access_token,
        httponly=True,
        secure=is_prod,
        samesite="Lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    response.set_cookie(
        key="_rid-rtk_",
        value=refresh_token,
        httponly=True,
        secure=is_prod,
        samesite="Lax",
        max_age=7 * 24 * 60 * 60,  
        path="/",
    )

    return {"message": "Login successful"}


def check_user_auth(request: Request):
    token = request.cookies.get("_aid-atk_")
    if not token:
        return {"authenticated": False, "message": "User not logged in"}

    user_data = decode_access_token(token)  
    return {"authenticated": True, "user": user_data}


def logout_user(response: Response):
    response.delete_cookie("_aid-atk_")
    response.delete_cookie("_rid-rtk_")
    return {"message": "Logged out"}


def handle_refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("_rid-rtk_")
    
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    try:
        payload = decode_access_token(refresh_token)
        
        username = payload.get("username")
        
        if not username:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        new_token = create_access_token(data={"sub": username})

        is_prod = os.getenv("ENV", "DEV").upper() == "PROD"
        response.set_cookie(
            key="_aid-atk_",
            value=new_token,
            httponly=True,
            secure=is_prod,
            samesite="Lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        return {"message": "Token refreshed"}

    except Exception:
        raise HTTPException(status_code=401, detail="Refresh token invalid or expired")
    