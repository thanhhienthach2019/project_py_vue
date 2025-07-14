from fastapi import APIRouter, Depends, Request
from app.core.permissions import get_user_permissions
from app.core.middleware import custom_verify_token

router = APIRouter()

@router.get("/permissions/me", summary="Get current user permissions")
def get_my_permissions(payload: dict = Depends(custom_verify_token)):
    username = payload.get("sub")
    permissions = get_user_permissions(username)
    return {"username": username, "permissions": permissions}