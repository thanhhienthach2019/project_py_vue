from fastapi import APIRouter, Depends, Response, Request, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import logout_user, login_user, check_user_auth, handle_refresh_token

router = APIRouter()

@router.post("/auth/login")
def login(response: Response, db: Session = Depends(get_db), username: str = Body(...), password: str = Body(...)):          
    return login_user(db, username, password, response)

@router.get("/auth/check-auth")
def check_auth(request: Request):
    return check_user_auth(request)


@router.post("/auth/logout")
def logout(response: Response):
    return logout_user(response)

@router.post("/auth/refresh-token")
def refresh_token(request: Request, response: Response):
    return handle_refresh_token(request, response)

