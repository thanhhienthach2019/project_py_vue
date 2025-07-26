import os
import pika
import logging
from app.core.config import settings

# Setup logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Get RabbitMQ URL from environment
RABBITMQ_URL = settings.RABBITMQ_URL

if not RABBITMQ_URL:
    raise ValueError("RABBITMQ_URL is not set in environment")

# Callback function when message received
def callback(ch, method, properties, body):
    username = body.decode()
    logger.info(f"✅ [Received] User logged in: {username}")

    # TODO: Save login info to DB if needed
    # from app.core.database import get_db
    # with next(get_db()) as db:
    #     db.add(LoginLog(...))
    #     db.commit()

# Main function to start RabbitMQ consumer
def start_consumer():
    logger.info("🚀 Starting RabbitMQ consumer...")

    try:
        # Connect to RabbitMQ
        params = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        exchange_name = "amq.topic"
        queue_name = "user_login_queue"
        routing_key = "user.login"

        # Ensure queue exists
        channel.queue_declare(queue=queue_name, durable=True)
        channel.queue_bind(exchange=exchange_name, queue=queue_name, routing_key=routing_key)

        logger.info("🎧 [Waiting for login messages] Press CTRL+C to exit")
        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

        # Start consuming
        channel.start_consuming()

    except Exception as e:
        logger.error(f"❌ Failed to start consumer: {e}")
        raise e
