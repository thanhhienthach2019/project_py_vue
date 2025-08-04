# app/api/v1/ws/ws_router.py

from fastapi import APIRouter
from app.api.v1.ws.settings import (
    menu_ws,
    permission_router_ws,
    policy_ws
    )
from app.api.v1.ws.auth import (
    user_ws
)

router = APIRouter()

# 1. Include all WebSocket routers
WS_ROUTERS = [
    menu_ws.router,
    permission_router_ws.router,
    policy_ws.router,
    user_ws.router,
]
for r in WS_ROUTERS:
    router.include_router(r)
