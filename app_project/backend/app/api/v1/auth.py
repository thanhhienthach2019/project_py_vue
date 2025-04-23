from fastapi import APIRouter, Depends, Response, Request, Body, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.rabbit import rabbit_client
from app.services.logger import log_login_event
from app.services.auth_service import (
    logout_user,
    login_user,
    check_user_auth,
    handle_refresh_token
)

router = APIRouter()

@router.post("/auth/login")
async def login(
    background_tasks: BackgroundTasks,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
    username: str = Body(...),
    password: str = Body(...)
):
    # Authenticate user
    result = login_user(db, username, password, response)

    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")

    background_tasks.add_task(
        log_login_event,
        db,
        username,
        client_ip,
        user_agent
    )

    # Publish login event using shared singleton rabbit_client
    background_tasks.add_task(
        rabbit_client.publish,
        "user.login",
        username.encode()
    )

    return result

@router.get("/auth/check-auth")
def check_auth(request: Request):
    return check_user_auth(request)

@router.post("/auth/logout")
def logout(response: Response):
    return logout_user(response)

@router.post("/auth/refresh-token")
def refresh_token(request: Request, response: Response):
    return handle_refresh_token(request, response)