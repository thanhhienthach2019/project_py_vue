from fastapi import WebSocket, WebSocketException, status
from sqlalchemy.orm import Session
from collections import defaultdict
from typing import Dict, List
from app.core.auth_ws.jwt_utils import decode_token
from app.core.auth_ws.ws_permission import check_ws_permission_by_path

connected_clients_by_channel: Dict[str, List[WebSocket]] = defaultdict(list)

async def broadcast_to_clients(channel: str, message: str):
    # print(f"[WS] 🔊 Broadcasting to {channel}: {message}")
    for client in connected_clients_by_channel[channel][:]:
        try:
            await client.send_text(message)
        except Exception:
            connected_clients_by_channel[channel].remove(client)

def add_client_to_channel(channel: str, websocket: WebSocket):
    if websocket not in connected_clients_by_channel[channel]:
        connected_clients_by_channel[channel].append(websocket)

def remove_client_from_channel(channel: str, websocket: WebSocket):
    if websocket in connected_clients_by_channel[channel]:
        connected_clients_by_channel[channel].remove(websocket)

async def safe_close_websocket(websocket: WebSocket, reason: str):
    try:
        if websocket.application_state.name != "DISCONNECTED":
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=reason)
    except Exception:
        pass

async def authenticate_websocket(websocket: WebSocket, token: str) -> str:
    try:
        payload = decode_token(token)
        username = payload.get("sub")
        if not username:
            raise Exception("Invalid user")
        return username
    except Exception:
        await websocket.accept()
        await safe_close_websocket(websocket, "Authentication failed")
        raise

async def authorize_websocket(websocket: WebSocket, db: Session, username: str, path: str):
    try:
        await check_ws_permission_by_path(
            db=db,
            websocket=websocket,
            username=username,
            full_path=path,
            method="GET",
            router_prefix="/ws"
        )
    except WebSocketException as e:
        await websocket.accept()
        await safe_close_websocket(websocket, e.reason)
        raise
    except Exception:
        await websocket.accept()
        await safe_close_websocket(websocket, "Permission check failed")
        raise
