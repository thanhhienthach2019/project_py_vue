# app/api/v1/ws/ws_registry.py

from app.api.v1.ws.settings import menu_ws, permission_router_ws, policy_ws

CHANNEL_MAP = {
    "menu": "menus_updates",
    "permission": "permissions_updates",
    "router": "permissions_updates",
    "binding": "permissions_updates",
    "policy": "policies_updates",
}

# Mapping từ Redis channel sang WebSocket broadcast function
REDIS_BROADCAST_MAP = {
    "menus_updates": menu_ws.broadcast_to_menu_clients,
    "permissions_updates": permission_router_ws.broadcast_to_permission_clients,
    "policies_updates": policy_ws.broadcast_to_policy_clients,
}

# Optional: helper để validate type_
def get_channel_by_type(type_: str) -> str:
    channel = CHANNEL_MAP.get(type_)
    if not channel:
        raise ValueError(f"[REDIS] ❌ Unknown type '{type_}', cannot determine channel.")
    return channel

def get_broadcast_by_channel(channel: str):
    func = REDIS_BROADCAST_MAP.get(channel)
    if not func:
        raise ValueError(f"[WS] ❌ No broadcast handler registered for channel: {channel}")
    return func
