# app/api/v1/ws/settings/policy_ws.py

from fastapi import APIRouter, WebSocket, Query, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.ws.ws_common import (
    authenticate_websocket,
    authorize_websocket,
    add_client_to_channel,
    remove_client_from_channel,
)
from app.api.v1.ws.ws_channels import POLICY_CHANNEL

router = APIRouter()

@router.websocket("/policies/permission")
async def websocket_permission_policy(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_policy_ws(websocket, token, db, POLICY_CHANNEL, "/policies/permission")

@router.websocket("/policies/group")
async def websocket_group_policy(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_policy_ws(websocket, token, db, POLICY_CHANNEL, "/policies/group")

@router.websocket("/policies/permission/view")
async def websocket_view_policy(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_policy_ws(websocket, token, db, POLICY_CHANNEL, "/policies/permission/view")


async def handle_policy_ws(websocket: WebSocket, token: str, db: Session, channel: str, path: str):
    try:
        username = await authenticate_websocket(websocket, token)
        await authorize_websocket(websocket, db, username, path)
        await websocket.accept()
        add_client_to_channel(channel, websocket)

        while True:
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        remove_client_from_channel(channel, websocket)
