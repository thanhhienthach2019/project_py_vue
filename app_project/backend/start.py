import uvicorn
import sys
import os
import asyncio
from app.core.config import settings
from app.rabbit_consumer import start_consumer 

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

async def start():
    # Chạy FastAPI với Uvicorn trong một task async
    loop = asyncio.get_event_loop()

    # Chạy consumer và FastAPI đồng thời
    task1 = loop.create_task(uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True))
    task2 = loop.create_task(start_consumer())  # chạy RabbitMQ Consumer

    # Chờ cho cả hai task hoàn thành
    await asyncio.gather(task1, task2)

if __name__ == "__main__":
    asyncio.run(start())