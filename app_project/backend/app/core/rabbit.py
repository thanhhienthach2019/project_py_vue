# app/core/rabbit.py
import aio_pika
from app.core.config import settings

class RabbitClient:
    """
    A simple RabbitMQ client for publishing messages.
    """
    def __init__(self, url: str):
        self.url = url
        self.connection: aio_pika.RobustConnection | None = None
        self.channel: aio_pika.abc.AbstractChannel | None = None

    async def connect(self):
        self.connection = await aio_pika.connect_robust(self.url)
        self.channel = await self.connection.channel()

    async def close(self):
        if self.channel:
            await self.channel.close()
        if self.connection:
            await self.connection.close()

    async def publish(self, routing_key: str, message: bytes):
        if not self.channel:
            raise RuntimeError("RabbitMQ channel not initialized")
        await self.channel.default_exchange.publish(
            aio_pika.Message(body=message),
            routing_key=routing_key
        )
# Singleton instance reused across the app
rabbit_client = RabbitClient(settings.RABBITMQ_URL)