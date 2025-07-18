from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.casbin import enforcer
from app.core.middleware import custom_verify_token
from app.models.settings.router_permission import Router, RouterPermission, Permission

def permission_required_root(permission_key: str, action: str = "view"):
    def dependency(payload: dict = Depends(custom_verify_token)):
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token: missing 'sub'")
        if not enforcer.enforce(username, permission_key, action):
            raise HTTPException(status_code=403, detail="Permission denied")
        return payload  
    return dependency

def get_user_permissions(username: str) -> list[str]:
    permissions = enforcer.get_implicit_permissions_for_user(username)
    return [f"{perm[1]}:{perm[2]}" for perm in permissions if len(perm) >= 3]

def permission_required(router_prefix: str = "/api/v1"):
    def dependency(
        db: Session = Depends(get_db),
        payload: dict = Depends(custom_verify_token),
        request: Request = None
    ):
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token: missing 'sub'")

        full_path = request.scope["route"].path
        trimmed_path = (
            full_path[len(router_prefix):] 
            if full_path.startswith(router_prefix) 
            else full_path
        )

        method = request.method.upper()    
        
        router = (
            db.query(Router)
              .filter(Router.path == trimmed_path, Router.method == method)
              .first()
        )

        if not router:
            raise HTTPException(status_code=404, detail="Router not found")

        rp = (
            db.query(RouterPermission)
              .filter(RouterPermission.router_id == router.id)
              .first()
        )
        if not rp:
            raise HTTPException(status_code=403, detail="No permissions configured for this router")

        perm = db.query(Permission).get(rp.permission_id)
        if not perm:
            raise HTTPException(status_code=403, detail="Permission not found")

        method_to_action = {
            "GET": "read",
            "POST": "create",
            "PUT": "update",
            "PATCH": "update",
            "DELETE": "delete",
        }
        expected_action = method_to_action.get(method)
        if perm.action != expected_action:
            raise HTTPException(
                status_code=403,
                detail=f"Invalid action for {method}: expected '{expected_action}', got '{perm.action}'"
            )

        if not enforcer.enforce(username, perm.resource, perm.action):
            raise HTTPException(status_code=403, detail="Permission denied")

        return payload

    return dependency

def permission_required_safe(router_prefix: str = "/api/v1"):
    def dependency(
        db: Session = Depends(get_db),
        request: Request = None
    ):
        method = request.method.upper()

        if method == "GET":
            return None  

        payload = custom_verify_token(request)
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token: missing 'sub'")

        full_path = request.scope["route"].path
        trimmed_path = (
            full_path[len(router_prefix):] 
            if full_path.startswith(router_prefix) 
            else full_path
        )

        router = (
            db.query(Router)
              .filter(Router.path == trimmed_path, Router.method == method)
              .first()
        )

        if not router:
            raise HTTPException(status_code=404, detail="Router not found")

        rp = (
            db.query(RouterPermission)
              .filter(RouterPermission.router_id == router.id)
              .first()
        )
        if not rp:
            raise HTTPException(status_code=403, detail="No permissions configured for this router")

        perm = db.query(Permission).get(rp.permission_id)
        if not perm:
            raise HTTPException(status_code=403, detail="Permission not found")

        method_to_action = {
            "POST": "create",
            "PUT": "update",
            "PATCH": "update",
            "DELETE": "delete",
        }
        expected_action = method_to_action.get(method)
        if not expected_action or perm.action != expected_action:
            raise HTTPException(
                status_code=403,
                detail=f"Invalid action for {method}: expected '{expected_action}', got '{perm.action}'"
            )

        if not enforcer.enforce(username, perm.resource, perm.action):
            raise HTTPException(status_code=403, detail="Permission denied")

        return payload

    return dependency
