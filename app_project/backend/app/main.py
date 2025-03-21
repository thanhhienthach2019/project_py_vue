from app.core.database import Base, engine
from fastapi import FastAPI
from app.api.v1 import inventory
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, auth, material, warehouse, maintenance

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(inventory.router, prefix="/api/v1", tags=["Inventory"])
app.include_router(material.router, prefix="/api/v1", tags=["Material"])
app.include_router(warehouse.router, prefix="/api/v1", tags=["Warehouse"])
app.include_router(maintenance.router, prefix="/api/v1", tags=["Maintenance"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ["*"] 👈 Cho phép tất cả nguồn gốc (chỉ dùng khi phát triển)
    allow_credentials=True,
    allow_methods=["*"],  # 👈 Cho phép tất cả phương thức (GET, POST, PUT, DELETE)
    allow_headers=["Content-Type", "Authorization"],  # 👈 ["*"] Cho phép tất cả headers
)

@app.get("/")
def home():
    return {"message": "Welcome to FastAPI"}