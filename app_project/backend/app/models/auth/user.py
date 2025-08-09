import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from sqlalchemy.dialects.mssql import NVARCHAR
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    # Use UUID primary key for better security
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String(20), nullable=True)  # admin, user
    full_name = Column(String(255), nullable=True)
    phone_number = Column(String(20), unique=True, nullable=True)
    profile_picture = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    is_verified = Column(Boolean, default=False)
    preferred_language = Column(String, default="en-US")

    # Optimistic concurrency control
    version = Column(Integer, nullable=False, default=1)
