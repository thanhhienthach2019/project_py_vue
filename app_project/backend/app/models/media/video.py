from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    LargeBinary,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    youtube_url = Column(String(500), nullable=False)
    thumbnail = Column(LargeBinary, nullable=True)
    published_at = Column(DateTime, nullable=False, default=func.now())
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())