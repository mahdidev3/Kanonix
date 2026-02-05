FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*
COPY pyproject.toml /app/
RUN pip install --no-cache-dir .[test]
COPY . /app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
