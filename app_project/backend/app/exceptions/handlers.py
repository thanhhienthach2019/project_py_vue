from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi import Request
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from fastapi.encoders import jsonable_encoder

def http_422(message: str, args: dict | None = None):
    raise HTTPException(status_code=HTTP_422_UNPROCESSABLE_ENTITY, detail={
        "message": message,
        "args": args or {},
    })

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = ".".join(str(x) for x in err["loc"] if x not in ("body", "query"))
        errors.append({ "field": field, "msg": err["msg"] })
    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({
            "message": "error.validation",
            "args": { "errors": errors }
        })
    )