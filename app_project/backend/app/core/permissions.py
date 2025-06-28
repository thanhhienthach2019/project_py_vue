from fastapi import Depends, HTTPException
from app.core.casbin import enforcer
from app.core.middleware import custom_verify_token

def permission_required(permission_key: str, action: str = "view"):
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