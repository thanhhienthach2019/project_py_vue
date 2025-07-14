from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class ScriptureCategory(Base):
    __tablename__ = "scripture_categories"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(150), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    scriptures = relationship("Scripture", back_populates="category")


class Scripture(Base):
    __tablename__ = "scriptures"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("scripture_categories.id"), nullable=False)
    title = Column(String(255), nullable=False)
    author = Column(String(150), nullable=True)
    content = Column(Text, nullable=True)
    pdf_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    category = relationship("ScriptureCategory", back_populates="scriptures")
