from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    LargeBinary,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Slide(Base):
    __tablename__ = "slides"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=True)
    image = Column(LargeBinary, nullable=False)  
    link = Column(String(500), nullable=True)
    order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

