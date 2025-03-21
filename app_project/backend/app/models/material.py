from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class Materials(Base):
    __tablename__ = "Materials"

    MaterialID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaterialCode = Column(String(50), unique=True, nullable=False)
    MaterialName = Column(String(255, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=False)
    ImageUrl = Column(String(500), nullable=True)
    Model = Column(String(100, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    Origin = Column(String(100, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    Unit = Column(String(50, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    Description = Column(String(500, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    CreatedAt = Column(DateTime, nullable=False, default=func.now())
    