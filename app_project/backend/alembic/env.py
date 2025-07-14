import os
from dotenv import load_dotenv
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

load_dotenv()

config = context.config

USE_SQLITE = True

if USE_SQLITE:
    db_url = os.getenv("DATABASE_URL_SQLITE")
else:
    db_url = os.getenv("DATABASE_URL")

config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.models.auth.user import User
# from app.models.inventory.warehouse import Warehouses
# from app.models.inventory.inventory import Inventory
# from app.models.inventory.stock_history import StockHistory
# from app.models.inventory.maintenance import MaintenanceRequests, MaintenanceRequestDetails
# from app.models.inventory.material import Materials
# from app.models.inventory.supplier import Supplier
# from app.models.inventory.unit import Unit
# from app.models.inventory.stock_movement import StockMovement
# from app.models.inventory.purchase_order import PurchaseOrder
# from app.models.inventory.purchase_order_item import PurchaseOrderItem
# from app.models.inventory.material_request import MaterialRequest
# from app.models.inventory.material_request_item import MaterialRequestItem
# from app.models.inventory.machine import Machine
from app.models.auth.log import LoginLog
from app.models.settings import MenuItem
from app.models.settings import router_permission
from app.models.news.announcement import Announcement
from app.models.news.document import DocumentCategory, Document
from app.models.news.donor import Donor
from app.models.news.festival import Festival
from app.models.news.news import NewsArticle, NewsCategory
from app.models.news.scripture import Scripture, ScriptureCategory
from app.models.news.slide import Slide

from app.core.database import Base  

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
