import uvicorn
import os
from app.api.v1.auth import auth, permissions, users
from app.api.v1.settings import menu, permission_router, policy
from app.core.database import Base, engine_sqlite
from app.core.rabbit import rabbit_client
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.inventory import inventory, machine, maintenance, material
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.inventory import warehouse
from app.api.v1.otrao_news import announcement, document, donor, festival, news, scripture, slide

Base.metadata.create_all(bind=engine_sqlite)

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
    allow_origins=["http://localhost:5173"], 
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
app.include_router(announcement.router, prefix="/api/v1", tags=["Announcement"])
app.include_router(document.router, prefix="/api/v1", tags=["Document"])
app.include_router(donor.router, prefix="/api/v1", tags=["Donor"])
app.include_router(festival.router, prefix="/api/v1", tags=["Festival"])
app.include_router(news.router, prefix="/api/v1", tags=["News"])
app.include_router(scripture.router, prefix="/api/v1", tags=["Scripture"])
app.include_router(slide.router, prefix="/api/v1", tags=["Slide"])


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