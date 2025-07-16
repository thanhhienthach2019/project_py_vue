# migrate_mssql_to_sqlite.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import Base
from app.models.auth.user import User
from app.models.settings.MenuItem import MenuItem
from app.models.settings.router_permission import Router, Permission, RouterPermission
from app.models.auth.log import LoginLog

# Casbin (nếu bạn dùng Casbin SQLAlchemy adapter)
from casbin_sqlalchemy_adapter import CasbinRule

# ----------- DATABASE CONFIGURATION -------------
MSSQL_URL = "mssql+pymssql://sa:D_basE2#yS@10.1.10.11:1433/YS_MI"
SQLITE_URL = "sqlite:///./data/sqlite.db"

# ----------- CONNECT TO DATABASES -------------
engine_mssql = create_engine(MSSQL_URL, pool_pre_ping=True, future=True)
engine_sqlite = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
    future=True,
)

SessionMSSQL = scoped_session(sessionmaker(bind=engine_mssql))
SessionSQLite = scoped_session(sessionmaker(bind=engine_sqlite))

# ----------- REMOVE MSSQL COLLATION IN METADATA (OPTIONAL BUT RECOMMENDED) -------------
for table in Base.metadata.tables.values():
    for column in table.columns:
        if hasattr(column, "collation"):
            column.collation = None  # Remove collation incompatible with SQLite

# ----------- CREATE TABLES IN SQLITE -------------
print("🔧 Creating tables in SQLite (if not exist)...")
Base.metadata.create_all(bind=engine_sqlite)

# Create CasbinRule table if used
try:
    CasbinRule.__table__.create(bind=engine_sqlite, checkfirst=True)
except Exception as e:
    print("⚠️ Unable to create CasbinRule table:", e)

# ----------- MIGRATION FUNCTION -------------
def copy_table_data(Model):
    print(f"\n➡️  Migrating table: {Model.__tablename__}")
    mssql_session = SessionMSSQL()
    sqlite_session = SessionSQLite()

    try:
        records = mssql_session.query(Model).all()
        count = 0
        for record in records:
            data = {
                k: v for k, v in vars(record).items()
                if not k.startswith("_")
            }
            sqlite_session.add(Model(**data))
            count += 1
        sqlite_session.commit()
        print(f"✅ Migrated {count} rows from {Model.__tablename__}")
    except SQLAlchemyError as e:
        print(f"❌ Error migrating {Model.__tablename__}: {e}")
        sqlite_session.rollback()
    finally:
        mssql_session.close()
        sqlite_session.close()

# ----------- LIST OF MODELS TO MIGRATE -------------
if __name__ == "__main__":
    print("🚀 Starting migration from MSSQL → SQLite")

    models_to_migrate = [
        User,
        Router,
        Permission,
        RouterPermission,
        MenuItem,
        LoginLog,
        CasbinRule,
    ]

    for model in models_to_migrate:
        copy_table_data(model)

    print("\n🏁 Migration completed successfully.")
