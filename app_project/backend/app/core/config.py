import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load environment variables từ file .env
dotenv_path = os.path.join(os.path.dirname(__file__), "../../.env") 
load_dotenv(dotenv_path)
# print("DATABASE_URL từ dotenv:", os.getenv("DATABASE_URL"))

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
    RABBITMQ_URL: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
# Tạo instance settings
settings = Settings()