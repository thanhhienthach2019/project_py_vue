# app/utils/file.py
import os
import datetime
from typing import Optional
from fastapi import UploadFile
from app.core.http_exceptions import http_400

async def save_upload_file(file: UploadFile, upload_dir: str) -> Optional[str]:
    if not file:
        return None

    if not file.filename:
        raise http_400("error.file.missing_filename")

    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    allowed = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
    if ext not in allowed:
        raise http_400("error.file.invalid_format")

    # Ensure upload directory exists
    os.makedirs(upload_dir, exist_ok=True)

    # Timestamp prefix to avoid collisions
    ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
    safe_name = f"{ts}_{file.filename.replace('/', '_').replace('\\', '_')}"
    path = os.path.join(upload_dir, safe_name)

    # Write file to disk
    with open(path, "wb") as buffer:
        buffer.write(await file.read())

    return safe_name
