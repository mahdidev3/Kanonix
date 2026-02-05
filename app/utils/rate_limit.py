from fastapi import HTTPException, Request

from app.core.config import get_settings
from app.core.redis import get_redis


async def rate_limit(request: Request, key: str) -> None:
    settings = get_settings()
    redis = await get_redis()
    redis_key = f"rl:{key}:{request.client.host}"
    count = await redis.incr(redis_key)
    if count == 1:
        await redis.expire(redis_key, 60)
    if count > settings.rate_limit_per_minute:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
