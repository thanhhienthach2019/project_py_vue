from fastapi import Request, Depends
from app.core.middleware import custom_verify_token

def get_current_user(request: Request) -> str:
    payload = custom_verify_token(request)
    return payload.get("sub")  
