from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()
connected_clients: List[WebSocket] = []

async def broadcast_to_permission_clients(message: str):
    disconnected = []
    for client in connected_clients:
        try:
            await client.send_text(message)
        except WebSocketDisconnect:
            disconnected.append(client)
    for client in disconnected:
        connected_clients.remove(client)

@router.websocket("/permission-routers")
async def websocket_permissions(websocket: WebSocket):
    print("📡 Client connecting to /permission-routers...")
    await websocket.accept()
    connected_clients.append(websocket)
    print(f"✅ Client connected: {websocket.client}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("❌ Client disconnected from /permission-routers")
        connected_clients.remove(websocket)
