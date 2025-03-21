from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)    
    is_active = Column(Boolean, default=True)
    role = Column(String(20), default="user") #admin, user
    