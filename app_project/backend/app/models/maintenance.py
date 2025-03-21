from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class MaintenanceRequests(Base):
    __tablename__ = "MaintenanceRequests"

    RequestID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    RequestNumber = Column(String(50), unique=True, nullable=False)
    MachineName = Column(String(255, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    Diagnosis = Column(String(500, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    RequestedBy = Column(String(100, collation="SQL_Latin1_General_CP1_CI_AS"), nullable=True)
    RequestDate = Column(DateTime, nullable=False, default=func.now())
    Status = Column(String(50), nullable=False, default="Pending")
    CreatedAt = Column(DateTime, nullable=False, default=func.now())
    ApprovedAt = Column(DateTime, nullable=True)

class MaintenanceRequestDetails(Base):
    __tablename__ = "MaintenanceRequestDetails"

    RequestDetailID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    RequestID = Column(Integer, ForeignKey("MaintenanceRequests.RequestID"), nullable=False)
    MaterialID = Column(Integer, ForeignKey("Materials.MaterialID"), nullable=False)
    WarehouseID = Column(Integer, ForeignKey("Warehouses.WarehouseID"), nullable=False)
    QuantityUsed = Column(Integer, nullable=False)
    CreatedDate = Column(DateTime, nullable=False, default=func.now())
    LastUpdated = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint("QuantityUsed > 0", name="check_quantity_used_positive"),
    )
