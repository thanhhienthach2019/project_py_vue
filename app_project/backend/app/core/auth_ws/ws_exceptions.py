from fastapi.exceptions import WebSocketException
from starlette.status import WS_1008_POLICY_VIOLATION

class WSForbidden(WebSocketException):
    def __init__(self, reason: str = "Permission denied"):
        super().__init__(code=WS_1008_POLICY_VIOLATION, reason=reason)