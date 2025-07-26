FROM python:3.12-slim

WORKDIR /app

# Cài các gói hệ thống cần thiết để build pyodbc
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    unixodbc-dev \
    libffi-dev \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9600", \
    "--ssl-certfile", "/app/cert/localhost.crt", "--ssl-keyfile", "/app/cert/localhost.key"]
