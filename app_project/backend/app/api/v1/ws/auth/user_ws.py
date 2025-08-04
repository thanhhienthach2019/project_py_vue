from fastapi import APIRouter, WebSocket, Query, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.ws.ws_common import (
    authenticate_websocket,
    authorize_websocket,
    add_client_to_channel,
    remove_client_from_channel,
    safe_close_websocket,
)
from app.api.v1.ws.ws_channels import USER_CHANNEL
router = APIRouter()
pathRouter = "/users"

@router.websocket(pathRouter)
async def websocket_user(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    try:
        username = await authenticate_websocket(websocket, token)
        await authorize_websocket(websocket, db, username, path=pathRouter)
        await websocket.accept()
        add_client_to_channel(USER_CHANNEL, websocket)

        while True:
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        remove_client_from_channel(USER_CHANNEL, websocket)