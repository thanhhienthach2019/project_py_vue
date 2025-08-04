import os
from datetime import timedelta
from fastapi import HTTPException, Response, Request
from sqlalchemy.orm import Session
from app.models.auth.user import User
from app.core.security import verify_password, create_access_token, decode_access_token, decode_access_token_payload
from app.core.config import settings
from app.schemas.generic_response import GenericResponse

def login_user(db: Session, username: str, password: str, response: Response) -> GenericResponse[dict]:
    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="error.auth.invalid_credentials")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    refresh_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(days=7))  

    response.set_cookie(
        key="_aid-atk_",
        value=access_token,
        httponly=False,
        secure=True,
        samesite="Lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    response.set_cookie(
        key="_rid-rtk_",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=7 * 24 * 60 * 60,
        path="/",
    )

    return GenericResponse(
        data={
            "username": user.username,
            "user_id": user.id,
            "preferred_language": user.preferred_language,
        },
        message="notification.auth.login_successful"
    )


def check_user_auth(request: Request) -> GenericResponse[dict]:
    token = request.cookies.get("_aid-atk_")
    if not token:
        return GenericResponse(
            data={"authenticated": False},
            message="error.auth.unauthenticated"
        )

    user_data = decode_access_token(token)
    return GenericResponse(
        data={"authenticated": True, "user": user_data},
        message="notification.auth.authenticated"
    )


def logout_user(response: Response) -> GenericResponse[dict]:
    response.delete_cookie("_aid-atk_")
    response.delete_cookie("_rid-rtk_")
    return GenericResponse(
        data=None,
        message="notification.auth.logout_success"
    )


def handle_refresh_token(request: Request, response: Response) -> GenericResponse[dict]:
    refresh_token = request.cookies.get("_rid-rtk_")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="error.auth.no_refresh_token")

    try:
        payload = decode_access_token_payload(refresh_token)
        sub = payload.get("sub")

        if not sub:
            raise HTTPException(status_code=401, detail="error.auth.invalid_refresh_token")

        new_token = create_access_token(data={"sub": sub})
        response.set_cookie(
            key="_aid-atk_",
            value=new_token,
            httponly=False,
            secure=True,
            samesite="Lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        return GenericResponse(
            data=None,
            message="notification.auth.token_refreshed"
        )

    except Exception:
        raise HTTPException(status_code=401, detail="error.auth.refresh_token_expired")

def update_preferred_language(request: Request, db: Session, lang: str) -> GenericResponse[dict]:
    token = request.cookies.get("_aid-atk_")
    if not token:
        raise HTTPException(status_code=401, detail="error.auth.unauthenticated")

    user_data = decode_access_token(token)
    username = user_data.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="error.auth.invalid_token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="error.auth.user_not_found")

    user.preferred_language = lang
    db.commit()

    return GenericResponse(
        data={"preferred_language": lang},
        message="notification.auth.language_updated"
    )