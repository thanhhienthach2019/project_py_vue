from jose import jwt, JWTError
from fastapi.exceptions import HTTPException
from starlette.status import HTTP_403_FORBIDDEN
from app.core.config import settings

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
