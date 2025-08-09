# app/core/auth.py
from fastapi import Depends, HTTPException
from app.core.casbin import enforcer
from app.core.middleware import custom_verify_token
from app.core.security import decode_access_token_payload
from uuid import UUID

def authorize(permission_key: str, action: str = "view"):
    def _auth(payload: dict = Depends(custom_verify_token)):
        username = payload.get("sub")
        if not enforcer.enforce(username, permission_key, action):
            raise HTTPException(status_code=403, detail="Permission denied")
        return True
    return _auth

def get_current_user_id(token: str) -> UUID:
    payload = decode_access_token_payload(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token subject")
    return UUID(user_id)