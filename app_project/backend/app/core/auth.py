# app/core/auth.py
from fastapi import Depends, HTTPException
from app.core.casbin import enforcer
from app.core.middleware import custom_verify_token

def authorize(permission_key: str, action: str = "view"):
    def _auth(payload: dict = Depends(custom_verify_token)):
        username = payload.get("sub")
        if not enforcer.enforce(username, permission_key, action):
            raise HTTPException(status_code=403, detail="Permission denied")
        return True
    return _auth