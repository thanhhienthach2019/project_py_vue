from fastapi import APIRouter, Depends, Response, Request, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db
from app.services.auth_service import authenticate_user, set_access_token_cookie
from app.core.security import decode_access_token

router = APIRouter()

@router.post("/token")
def login(response: Response, db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):    
    user = authenticate_user(db, form_data.username, form_data.password)
    return set_access_token_cookie(response, user)

@router.get("/check-auth")
def check_auth(request: Request):
    token = request.cookies.get("token")   
    if not token:
        return {"authenticated": False, "message": "User not logged in"}

    try:
        user_data = decode_access_token(token)
        return {"authenticated": True, "user": user_data}
    except Exception:
        return {"authenticated": False, "message": "Invalid token"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}

