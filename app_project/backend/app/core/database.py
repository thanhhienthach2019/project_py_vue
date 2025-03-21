from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

# Khởi tạo engine với `pool_pre_ping=True` để tránh lỗi timeout
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Tắt log SQL để tránh lộ dữ liệu (bật nếu cần debug)
    pool_pre_ping=True,  # Kiểm tra kết nối trước khi dùng
    future=True  # Hỗ trợ tốt hơn cho SQLAlchemy 2.x
)

try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Kết nối thành công:", result.fetchone())
except Exception as e:
    print("❌ Lỗi kết nối:", e)

# Tạo SessionLocal để dùng trong ứng dụng
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Khai báo Base cho các models
Base = declarative_base()

# Hàm lấy session database, xử lý lỗi khi kết nối bị mất
def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    except SQLAlchemyError as e:
        print(f"Lỗi kết nối database: {e}")  # Log lỗi (có thể thay bằng logging)
        if db:
            db.rollback()  # Rollback nếu có lỗi
            raise HTTPException(status_code=500, detail="Database connection error")  # Báo lỗi HTTP 500
    finally:
        if db:
            db.close()
