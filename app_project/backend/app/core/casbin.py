import casbin
from casbin_sqlalchemy_adapter import Adapter
from app.core.database import engine_sqlite

adapter = Adapter(engine_sqlite)  # Lưu policy vào DB

# Khởi tạo Enforcer (không truyền enable_auto_save ở đây)
enforcer = casbin.Enforcer("app/auth/model.conf", adapter)

# Gọi hàm enable_auto_save() sau đó
enforcer.enable_auto_save(True)
