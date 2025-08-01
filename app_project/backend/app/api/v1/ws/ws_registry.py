from app.api.v1.ws.ws_common import broadcast_to_clients
from app.api.v1.ws.ws_channels import MENU_CHANNEL, PERMISSION_CHANNEL, POLICY_CHANNEL

# Mapping type (logic app) → channel name
TYPE_TO_CHANNEL_MAP = {
    "menu": MENU_CHANNEL,
    "permission": PERMISSION_CHANNEL,
    "router": PERMISSION_CHANNEL,
    "binding": PERMISSION_CHANNEL,
    "policy": POLICY_CHANNEL,
}

# Return function broadcast for Redis pub/sub
def get_channel_by_type(type_: str) -> str:
    channel = TYPE_TO_CHANNEL_MAP.get(type_)
    if not channel:
        raise ValueError(f"[WS_REGISTRY] ❌ Unknown type: {type_}")
    return channel

def get_broadcast_by_channel(channel: str):
    return lambda message: broadcast_to_clients(channel, message)