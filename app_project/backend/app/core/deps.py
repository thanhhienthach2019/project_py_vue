from fastapi import Request, Depends
from app.core.middleware import custom_verify_token
from app.core.i18n import get_locale_from_header, load_messages

def get_current_user(request: Request) -> str:
    payload = custom_verify_token(request)
    return payload.get("sub")  

async def get_locale(request: Request = Depends()):
    return await get_locale_from_header(request)

async def t(key: str, locale: str = Depends(get_locale)) -> str:
    msgs = load_messages(locale)
    template = msgs.get(key, key)
    return template