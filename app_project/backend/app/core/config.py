# backend/app/core/config.py
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

env_file_path = BASE_DIR / ".env.dev"    
# env_file_path = BASE_DIR / ".env.prod"


class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_SQLITE: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    BASE_URL: str
    PORT: int
    BASE_URL_FE: str
    UPLOAD_DIR: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RABBITMQ_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=str(env_file_path),
        env_file_encoding="utf-8"
    )

    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        if path.is_absolute():
            return path
        return BASE_DIR / path

settings = Settings()
