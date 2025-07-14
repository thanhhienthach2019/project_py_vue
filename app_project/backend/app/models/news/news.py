from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Boolean,
    LargeBinary,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class NewsCategory(Base):
    __tablename__ = "news_categories"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(150), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    articles = relationship("NewsArticle", back_populates="category")


class NewsArticle(Base):
    __tablename__ = "news_articles"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("news_categories.id"), nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(300), unique=True, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    image = Column(LargeBinary, nullable=True)
    published_at = Column(DateTime, nullable=False, default=func.now())
    is_published = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    category = relationship("NewsCategory", back_populates="articles")

