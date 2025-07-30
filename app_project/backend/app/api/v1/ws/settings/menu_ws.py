# app/api/v1/ws/settings/menu_ws.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()
connected_clients: List[WebSocket] = []

async def broadcast_to_menu_clients(message: str):
    disconnected = []
    for client in connected_clients:
        try:
            await client.send_text(message)
        except WebSocketDisconnect:
            disconnected.append(client)
    for client in disconnected:
        connected_clients.remove(client)

@router.websocket("/menus")
async def websocket_menu(websocket: WebSocket):
    print("📡 Client connecting to /menus...")
    await websocket.accept()
    connected_clients.append(websocket)
    print(f"✅ Client connected: {websocket.client}")
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        print("❌ Client disconnected from /menus")
        connected_clients.remove(websocket)
