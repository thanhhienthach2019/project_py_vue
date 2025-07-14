from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Boolean,
    LargeBinary,
    Float,
    func,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class Donor(Base):
    __tablename__ = "donors"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    donation_amount = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    image = Column(LargeBinary, nullable=True)  
    donated_at = Column(DateTime, nullable=False, default=func.now())
