# app/api/v1/ws/ws.py

from fastapi import APIRouter
import asyncio
import json

from app.core.redis import redis_subscriber
from app.api.v1.ws.settings import menu_ws, permission_router_ws, policy_ws
from app.api.v1.ws.ws_registry import REDIS_BROADCAST_MAP

router = APIRouter()
router.include_router(menu_ws.router)
router.include_router(permission_router_ws.router)
router.include_router(policy_ws.router)

async def _redis_channel_listener(channel: str, broadcast_func):
    async for raw_msg in redis_subscriber(channel):
        try:
            await broadcast_func(raw_msg)
        except Exception as e:
            print(f"[REDIS] ❌ Error broadcasting to {channel}: {e}")

def start_redis_listener():
    for channel, broadcast_func in REDIS_BROADCAST_MAP.items():
        asyncio.create_task(_redis_channel_listener(channel, broadcast_func))
