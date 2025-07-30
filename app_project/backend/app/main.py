import uvicorn
import os
from app.api.v1.auth import auth, permissions, users
from app.api.v1.settings import menu, permission_router, policy
from app.core.database import Base, engine_sqlite
from app.core.rabbit import rabbit_client
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.inventory import inventory, machine, maintenance, material
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.inventory import warehouse
from app.api.v1.otrao_news import announcement, document, donor, festival, news, scripture, slide
from app.api.v1.ws.ws import start_redis_listener
from app.api.v1.ws import ws
from app.api.v1.ws.settings.permission_router_ws import router as ws_permission_router

Base.metadata.create_all(bind=engine_sqlite)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await rabbit_client.connect()
    start_redis_listener()
    yield
    await rabbit_client.close()
    # Optional: cleanup

app = FastAPI(lifespan=lifespan)

# print("Using SQLite DB:", os.path.abspath("./data/sqlite.db"))

base_urls = os.getenv("BASE_URL_FE", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
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
app.include_router(permission_router.router, prefix="/api/v1", tags=["Router"])

# otrao_news
app.include_router(announcement.router, prefix="/api/v1/announcements", tags=["Announcements"])
app.include_router(document.router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(donor.router, prefix="/api/v1/donors", tags=["Donors"])
app.include_router(festival.router, prefix="/api/v1/festivals", tags=["Festivals"])
app.include_router(news.router, prefix="/api/v1/news", tags=["News"])
app.include_router(scripture.router, prefix="/api/v1/scriptures", tags=["Scriptures"])
app.include_router(slide.router, prefix="/api/v1/slides", tags=["Slides"])

# Web socket
app.include_router(ws.router, prefix="/api/v1/ws")


upload_path = settings.upload_path
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/public", StaticFiles(directory=upload_path), name="public")
# print("DEBUG: UPLOAD_DIR =", settings.UPLOAD_DIR)
@app.get("/")
def home():
    return {"message": "Welcome to FastAPI with RabbitMQ"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True,
        ssl_certfile="./cert/localhost.crt",  
        ssl_keyfile="./cert/localhost.key",   
    )