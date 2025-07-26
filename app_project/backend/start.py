import uvicorn
import sys
import os
import asyncio
import threading

from app.core.config import settings
from app.rabbit_consumer import start_consumer

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

async def start_fastapi():
    """
    Run FastAPI server using uvicorn with HTTPS
    """
    config = uvicorn.Config(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True,
        ssl_certfile="./cert/localhost.crt",
        ssl_keyfile="./cert/localhost.key"
    )
    server = uvicorn.Server(config)
    await server.serve()


def run_consumer_in_thread():
    """
    Run RabbitMQ consumer in a separate thread to avoid blocking.
    """
    if settings.RABBITMQ_URL:
        print(f"🟢 RabbitMQ consumer enabled. Connecting to: {settings.RABBITMQ_URL}")
        consumer_thread = threading.Thread(target=start_consumer, daemon=True)
        consumer_thread.start()
    else:
        print("⚠️  RABBITMQ_URL not set. Skipping consumer.")

async def start():
    # Start RabbitMQ consumer in a background thread
    run_consumer_in_thread()

    # Run FastAPI server (non-blocking)
    await start_fastapi()

if __name__ == "__main__":
    asyncio.run(start())
