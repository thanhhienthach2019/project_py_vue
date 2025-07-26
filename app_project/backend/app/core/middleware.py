from fastapi import Request, HTTPException
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from app.core.config import settings
from app.exceptions.auth_exceptions import (
    MissingTokenException,
    ExpiredTokenException,
    InvalidTokenException,
    GeneralAuthException,
)

def custom_verify_token(request: Request):
    token = request.cookies.get("_aid-atk_")         
    if not token:
        raise MissingTokenException()
    
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except ExpiredSignatureError:
        raise ExpiredTokenException()
    except InvalidTokenError:
        raise InvalidTokenException()
    except Exception as e:
        raise GeneralAuthException(str(e))
