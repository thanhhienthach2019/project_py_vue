from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base  

class LoginLog(Base):
    __tablename__ = "LoginLogs"

    Id = Column(Integer, primary_key=True, index=True)
    Username = Column(String(100))
    Timestamp = Column(DateTime, default=datetime.utcnow)
    EventType = Column(String(50), default="user.login")
    IPAddress = Column(String(100), nullable=True)
    UserAgent = Column(String(255), nullable=True)
