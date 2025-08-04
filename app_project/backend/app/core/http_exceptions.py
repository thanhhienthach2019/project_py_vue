from fastapi import HTTPException
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from typing import Optional, Dict


def http_exception(
    status_code: int,
    message: str,
    args: Optional[Dict] = None,
):
    raise HTTPException(
        status_code=status_code,
        detail={
            "message": message, 
            "args": args or {},  
        }
    )


def http_400(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_400_BAD_REQUEST, message, args)

def http_401(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_401_UNAUTHORIZED, message, args)

def http_403(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_403_FORBIDDEN, message, args)

def http_404(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_404_NOT_FOUND, message, args)

def http_409(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_409_CONFLICT, message, args)

def http_422(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_422_UNPROCESSABLE_ENTITY, message, args)

def http_500(message: str, args: Optional[Dict] = None):
    http_exception(HTTP_500_INTERNAL_SERVER_ERROR, message, args)
