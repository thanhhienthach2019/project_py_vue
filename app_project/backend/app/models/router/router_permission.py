from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from app.core.database import Base
from sqlalchemy.orm import relationship

class Router(Base):
    __tablename__ = "routers"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    path = Column(String(255))
    method = Column(String(10), nullable=False)
    __table_args__ = (UniqueConstraint("path", "method"),)
    
    router_permissions = relationship("RouterPermission", back_populates="router")

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True)
    resource = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)
    __table_args__ = (UniqueConstraint("resource", "action"),)

    router_permissions = relationship("RouterPermission", back_populates="permission")


class RouterPermission(Base):
    __tablename__ = "router_permissions"

    id = Column(Integer, primary_key=True)
    router_id = Column(Integer, ForeignKey("routers.id"))
    permission_id = Column(Integer, ForeignKey("permissions.id"))
    __table_args__ = (UniqueConstraint("router_id", "permission_id"),)

    router = relationship("Router", back_populates="router_permissions")
    permission = relationship("Permission", back_populates="router_permissions")