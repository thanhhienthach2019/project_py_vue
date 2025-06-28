import os
from dotenv import load_dotenv
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Load biến môi trường từ .env
load_dotenv()

# Lấy Alembic config object
config = context.config

# Ghi đè `sqlalchemy.url` bằng DATABASE_URL từ .env
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Cấu hình logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import tất cả các models
from app.models.user import User
from app.models.warehouse import Warehouses
from app.models.inventory import Inventory
from app.models.stock_history import StockHistory
from app.models.maintenance import MaintenanceRequests, MaintenanceRequestDetails
from app.models.material import Materials
from app.models.supplier import Supplier
from app.models.unit import Unit
from app.models.stock_movement import StockMovement
from app.models.purchase_order import PurchaseOrder
from app.models.purchase_order_item import PurchaseOrderItem
from app.models.material_request import MaterialRequest
from app.models.material_request_item import MaterialRequestItem
from app.models.machine import Machine
from app.models.log import LoginLog
from app.models.menu import MenuItem

# Lấy metadata từ tất cả models
from app.core.database import Base  # Đảm bảo tất cả models kế thừa từ Base

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Chạy migration trong chế độ offline."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Chạy migration trong chế độ online."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
