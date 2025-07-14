from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    announcement_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
