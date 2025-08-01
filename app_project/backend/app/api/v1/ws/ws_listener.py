# app/api/v1/ws/ws_listener.py

import asyncio
from app.core.redis import redis_subscriber
from app.api.v1.ws.ws_channels import MENU_CHANNEL, PERMISSION_CHANNEL, POLICY_CHANNEL
from app.api.v1.ws.ws_registry import get_broadcast_by_channel

WS_CHANNELS = [MENU_CHANNEL, PERMISSION_CHANNEL, POLICY_CHANNEL]

async def _redis_channel_listener(channel: str):
    broadcast_func = get_broadcast_by_channel(channel)
    async for raw_msg in redis_subscriber(channel):
        # print(f"[REDIS] 🔁 Message received from {channel}: {raw_msg}")
        try:
            await broadcast_func(raw_msg)
        except Exception as e:
            print(f"[REDIS] ❌ Error broadcasting to {channel}: {e}")

def start_redis_listeners():
    for channel in WS_CHANNELS:
        asyncio.create_task(_redis_channel_listener(channel))
