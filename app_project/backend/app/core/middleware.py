from fastapi import Request, HTTPException
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from app.core.config import settings

def custom_verify_token(request: Request):
    token = request.cookies.get("_aid-atk_")         
    if not token:
        raise HTTPException(status_code=403, detail="Missing authentication token")
    
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid authentication token")
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Authentication error: {str(e)}")
