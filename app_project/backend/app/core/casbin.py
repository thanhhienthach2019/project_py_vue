import casbin
import logging
from casbin_sqlalchemy_adapter import Adapter
from app.core.database import engine_postgres

adapter = Adapter(engine_postgres)  # Lưu policy vào DB

# Khởi tạo Enforcer (không truyền enable_auto_save ở đây)
enforcer = casbin.Enforcer("app/auth/model.conf", adapter)

logging.getLogger("casbin").setLevel(logging.WARNING)

# Gọi hàm enable_auto_save() sau đó
enforcer.enable_auto_save(True)
