# models/menu.menu_item.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    path = Column(String(200), nullable=False)
    icon = Column(String(50), nullable=True)
    permission_key = Column(String, unique=True, index=True)
    parent_id = Column(Integer, ForeignKey("menu_items.id"), nullable=True)
    order = Column(Integer, default=0)

    children = relationship("MenuItem", backref="parent", remote_side=[id])
