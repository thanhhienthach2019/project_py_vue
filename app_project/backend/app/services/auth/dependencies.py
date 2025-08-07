# services/auth/dependencies.py

from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.auth.user import User
from app.core.security import decode_access_token
from app.core.database import get_db


def get_current_user_id_from_cookie(
    request: Request, db: Session = Depends(get_db)
) -> int:
    token = request.cookies.get("_aid-atk_")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthenticated: No token provided",
        )

    try:
        payload = decode_access_token(token)
        username = payload.get("username")
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing username",
            )

        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user.id

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
