# models/menu.menu_item.py
import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    # Use UUID primary key to prevent ID guessing
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    title = Column(String(100), nullable=False)
    path = Column(String(200), nullable=False)
    icon = Column(String(50), nullable=True)
    permission_key = Column(String, unique=True, index=True)

    # Parent relationship with UUID foreign key
    parent_id = Column(UUID(as_uuid=True), ForeignKey("menu_items.id"), nullable=True)
    order = Column(Integer, default=0)

    # Optimistic concurrency control
    version = Column(Integer, nullable=False, default=1)

    # Timestamp for update tracking
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Cascade deletes for orphaned children
    children = relationship(
        "MenuItem",
        backref="parent",
        remote_side=[id],
        cascade="all, delete-orphan",
        single_parent=True 
    )
