import uuid
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class Router(Base):
    __tablename__ = "routers"

    # Use UUID primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255))
    path = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)

    __table_args__ = (
        UniqueConstraint("path", "method"),
    )

    # Optimistic concurrency control
    version = Column(Integer, nullable=False, default=1)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    router_permissions = relationship(
        "RouterPermission",
        back_populates="router",
        cascade="all, delete-orphan"
    )

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resource = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)

    __table_args__ = (
        UniqueConstraint("resource", "action"),
    )

    version = Column(Integer, nullable=False, default=1)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    router_permissions = relationship(
        "RouterPermission",
        back_populates="permission",
        cascade="all, delete-orphan"
    )

class RouterPermission(Base):
    __tablename__ = "router_permissions"

    # Use UUID primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    router_id = Column(UUID(as_uuid=True), ForeignKey("routers.id"), nullable=False)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("router_id", "permission_id"),
    )

    # Concurrency fields
    version = Column(Integer, nullable=False, default=1)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    router = relationship("Router", back_populates="router_permissions")
    permission = relationship("Permission", back_populates="router_permissions")
