from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    LargeBinary,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class DocumentCategory(Base):
    __tablename__ = "document_categories"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(150), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(LargeBinary, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    documents = relationship("Document", back_populates="category")


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("document_categories.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    image = Column(LargeBinary, nullable=True)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    category = relationship("DocumentCategory", back_populates="documents")
