# app/core/redis.py

import json
import redis.asyncio as redis
from app.core.config import settings
from app.api.v1.ws.ws_registry import get_channel_by_type

_redis = redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis_client() -> redis.Redis:
    return _redis


async def publish_update(action: str, type_: str, item: dict):
    message = {
        "action": action,
        "type": type_,
        "item": item,
    }

    channel_name = get_channel_by_type(type_)
    if not channel_name:
        raise ValueError(f"[REDIS] ❌ Unknown type '{type_}', cannot determine channel.")

    await _redis.publish(channel_name, json.dumps(message))
    # print(f"[REDIS] ✅ Published to {channel_name}: {message}")


async def redis_subscriber(channel_name: str):

    pubsub = _redis.pubsub()
    await pubsub.subscribe(channel_name)
    async for message in pubsub.listen():
        if message["type"] == "message":
            yield message["data"]
