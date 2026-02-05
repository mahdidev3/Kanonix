from pathlib import Path
from uuid import uuid4

import aiofiles
import boto3
from fastapi import UploadFile

from app.core.config import get_settings

settings = get_settings()


def _minio_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.minio_endpoint,
        aws_access_key_id=settings.minio_access_key,
        aws_secret_access_key=settings.minio_secret_key,
        region_name=settings.minio_region,
    )


async def save_file(file: UploadFile) -> str:
    name = f"{uuid4()}-{file.filename}"
    if settings.storage_mode == "local":
        Path(settings.local_storage_path).mkdir(parents=True, exist_ok=True)
        file_path = Path(settings.local_storage_path) / name
        async with aiofiles.open(file_path, "wb") as out:
            content = await file.read()
            await out.write(content)
        return str(file_path)

    content = await file.read()
    client = _minio_client()
    client.put_object(Bucket=settings.minio_bucket, Key=name, Body=content)
    return f"{settings.minio_endpoint}/{settings.minio_bucket}/{name}"
