import uvicorn
import os
from app.core.database import Base, engine
from app.core.rabbit import rabbit_client
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1 import inventory
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, auth, material, warehouse, maintenance, machine, menu, policy, permissions

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.on_event("startup")
async def startup_event():
    # Establish RabbitMQ connection on app startup
    await rabbit_client.connect()
    # Optionally declare queues used in the app
    await rabbit_client.channel.declare_queue("user.login", durable=True)

@app.on_event("shutdown")
async def shutdown_event():
    # Close RabbitMQ connection gracefully
    await rabbit_client.close()

base_urls = os.getenv("BASE_URL_FE", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ["*"] 👈 Cho phép tất cả nguồn gốc (chỉ dùng khi phát triển)
    allow_credentials=True,
    allow_methods=["*"],  # 👈 Cho phép tất cả phương thức (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # 👈 ["*"] Cho phép tất cả headers
)
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(inventory.router, prefix="/api/v1", tags=["Inventory"])
app.include_router(material.router, prefix="/api/v1", tags=["Material"])
app.include_router(warehouse.router, prefix="/api/v1", tags=["Warehouse"])
app.include_router(maintenance.router, prefix="/api/v1", tags=["Maintenance"])
app.include_router(machine.router, prefix="/api/v1", tags=["Machine"])
app.include_router(menu.router, prefix="/api/v1", tags=["Menu"])
app.include_router(policy.router, prefix="/api/v1", tags=["Policy"])
app.include_router(permissions.router, prefix="/api/v1", tags=["Permission"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR")
app.mount("/public", StaticFiles(directory=UPLOAD_DIR), name="public")
@app.get("/")
def home():
    return {"message": "Welcome to FastAPI with RabbitMQ"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )