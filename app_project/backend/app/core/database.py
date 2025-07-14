from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import Generator
from app.core.config import settings
import logging

# ---------- Logging configuration ----------
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ---------- SQLAlchemy Base ----------
Base = declarative_base()

# ---------- Engine configuration ----------

# MSSQL engine
engine_mssql = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    future=True,
)

# SQLite engine
engine_sqlite = create_engine(
    settings.DATABASE_URL_SQLITE,
    echo=False,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
    future=True,
)

# ---------- Session factories ----------

SessionLocalMSSQL = sessionmaker(bind=engine_mssql, autocommit=False, autoflush=False)
SessionLocalSQLite = sessionmaker(bind=engine_sqlite, autocommit=False, autoflush=False)

# ---------- Test connection for engines ----------

def test_database_connection(engine, name: str = "") -> None:
    """
    Tests a database connection by executing a simple SELECT statement.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            logger.info(f"✅ Successfully connected to {name}.")
    except Exception as e:
        logger.error(f"❌ Failed to connect to {name}: {e}")

# Perform connection tests
test_database_connection(engine_mssql, "MSSQL")
test_database_connection(engine_sqlite, "SQLite")

# ---------- Dependency functions for FastAPI ----------

def get_db_mssql() -> Generator[Session, None, None]:
    """
    Dependency function to get a MSSQL database session.
    Rolls back and closes the session in case of errors.
    """
    db = SessionLocalMSSQL()
    try:
        yield db
    except SQLAlchemyError as e:
        db.rollback()
        logger.exception("Error occurred during MSSQL session.")
        raise HTTPException(status_code=500, detail="MSSQL database error")
    finally:
        db.close()

def get_db_sqlite() -> Generator[Session, None, None]:
    """
    Dependency function to get a SQLite database session.
    Rolls back and closes the session in case of errors.
    """
    db = SessionLocalSQLite()
    try:
        yield db
    except SQLAlchemyError as e:
        db.rollback()
        logger.exception("Error occurred during SQLite session.")
        raise HTTPException(status_code=500, detail="SQLite database error")
    finally:
        db.close()

# ---------- Default DB session for backward compatibility ----------

get_db = get_db_sqlite  # Default to MSSQL (for legacy usage)
