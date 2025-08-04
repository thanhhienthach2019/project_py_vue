from fastapi import APIRouter, Depends, Response, Request, Body, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rabbit import rabbit_client
from app.services.auth.logger import log_login_event
from app.schemas.auth.user import UpdateLanguageRequest
from app.schemas.generic_response import GenericResponse
from app.services.auth.auth_service import (
    logout_user,
    login_user,
    check_user_auth,
    handle_refresh_token,
    update_preferred_language
)

router = APIRouter()


@router.post("/auth/login", response_model=GenericResponse[dict])
async def login(
    background_tasks: BackgroundTasks,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
    username: str = Body(...),
    password: str = Body(...)
):
    result = login_user(db, username, password, response)

    # Ghi log và gửi RabbitMQ không ảnh hưởng response
    background_tasks.add_task(
        log_login_event,
        db,
        username,
        request.client.host,
        request.headers.get("user-agent")
    )

    background_tasks.add_task(
        rabbit_client.publish,
        "user.login",
        username.encode()
    )

    return result


@router.get("/auth/check-auth", response_model=GenericResponse[dict])
def check_auth(request: Request):
    return check_user_auth(request)


@router.post("/auth/logout", response_model=GenericResponse[None])
def logout(response: Response):
    return logout_user(response)


@router.post("/auth/refresh-token", response_model=GenericResponse[None])
def refresh_token(request: Request, response: Response):
    return handle_refresh_token(request, response)


@router.put("/auth/set-language", response_model=GenericResponse[dict])
def set_preferred_language(
    payload: UpdateLanguageRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    return update_preferred_language(request, db, payload.lang)
