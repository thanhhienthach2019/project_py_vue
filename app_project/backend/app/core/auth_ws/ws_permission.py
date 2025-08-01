from fastapi import WebSocket
from sqlalchemy.orm import Session
from starlette.status import WS_1008_POLICY_VIOLATION
from fastapi.exceptions import WebSocketException
from app.models.settings.router_permission import Router, RouterPermission, Permission
from app.core.casbin import enforcer

async def check_ws_permission_by_path(
    *,
    db: Session,
    websocket: WebSocket,
    username: str,
    full_path: str,
    method: str = "GET",
    router_prefix: str = "/ws"
):
    trimmed_path = (
        full_path[len(router_prefix):] 
        if full_path.startswith(router_prefix) 
        else full_path
    )

    router = (
        db.query(Router)
          .filter(Router.path == trimmed_path, Router.method == method.upper())
          .first()
    )

    if not router:
        await websocket.close(code=WS_1008_POLICY_VIOLATION)
        raise WebSocketException(code=WS_1008_POLICY_VIOLATION, reason="Router not found")

    rp = (
        db.query(RouterPermission)
          .filter(RouterPermission.router_id == router.id)
          .first()
    )

    if not rp:
        await websocket.close(code=WS_1008_POLICY_VIOLATION)
        raise WebSocketException(code=WS_1008_POLICY_VIOLATION, reason="Permission not configured")

    perm = db.query(Permission).get(rp.permission_id)

    if not perm:
        await websocket.close(code=WS_1008_POLICY_VIOLATION)
        raise WebSocketException(code=WS_1008_POLICY_VIOLATION, reason="Permission not found")

    method_to_action = {
        "GET": "read",
        "POST": "create",
        "PUT": "update",
        "PATCH": "update",
        "DELETE": "delete",
    }
    expected_action = method_to_action.get(method.upper())    

    if perm.action != expected_action:
        await websocket.close(code=WS_1008_POLICY_VIOLATION)
        raise WebSocketException(
            code=WS_1008_POLICY_VIOLATION,
            reason=f"Invalid permission action. Expected {expected_action}, got {perm.action}"
        )

    result = enforcer.enforce(username, perm.resource, perm.action)    

    if not result:
        await websocket.close(code=WS_1008_POLICY_VIOLATION)
        raise WebSocketException(code=WS_1008_POLICY_VIOLATION, reason="Permission denied")
