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
from app.api.v1.ws.ws_channels import PERMISSION_CHANNEL

router = APIRouter()

@router.websocket("/router-permissions/routers")
async def websocket_router_access(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_access_permission_ws(websocket, token, db, PERMISSION_CHANNEL, "/router-permissions/routers")

@router.websocket("/router-permissions/permissions")
async def websocket_permission_access(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_access_permission_ws(websocket, token, db, PERMISSION_CHANNEL, "/router-permissions/permissions")

@router.websocket("/router-permissions/bindings")
async def websocket_binding_access(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_access_permission_ws(websocket, token, db, PERMISSION_CHANNEL, "/router-permissions/bindings")

@router.websocket("/router-permissions/bindings/details")
async def websocket_binding_details_access(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    await handle_access_permission_ws(websocket, token, db, PERMISSION_CHANNEL, "/router-permissions/bindings/details")

async def handle_access_permission_ws(websocket: WebSocket, token: str, db: Session, channel: str, path: str):
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
