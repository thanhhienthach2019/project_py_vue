import pika
import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL")

def callback(ch, method, properties, body):
    username = body.decode()
    print(f"✅ [Received] User logged in: {username}")
    # Bạn có thể lưu vào database ở đây

def start_consumer():
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    # Tạo exchange nếu cần (dùng default hoặc "amq.topic" nếu từ API)
    exchange_name = "amq.topic"
    queue_name = "user_login_queue"
    routing_key = "user.login"

    # Đảm bảo queue tồn tại
    channel.queue_declare(queue=queue_name, durable=True)
    # Bind queue với exchange và routing key
    channel.queue_bind(exchange=exchange_name, queue=queue_name, routing_key=routing_key)

    print("🎧 [Waiting for login messages] To exit press CTRL+C")
    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

    channel.start_consuming()
