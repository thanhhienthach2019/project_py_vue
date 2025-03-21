FROM python:3.12

WORKDIR /app

#copy requirements
COPY requirements.txt /app/

#install
RUN pip install --no-cache-dir -r requirements.txt

#copy all source code to container
COPY . /app

#start FastAPI
CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" ]