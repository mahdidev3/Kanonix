import time
import uuid

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import text

from app.api import admin, auth, councils, events, gallery, kanoons, market, orders, reviews
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.core.redis import get_redis
from app.db.session import engine

settings = get_settings()
configure_logging()
logger = structlog.get_logger()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url="/docs" if settings.swagger_enabled else None,
    openapi_url="/openapi.json" if settings.swagger_enabled else None,
    default_response_class=ORJSONResponse,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def correlation_middleware(request: Request, call_next):
    cid = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
    structlog.contextvars.bind_contextvars(correlation_id=cid)
    start = time.time()
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("unhandled_exception")
        raise
    response.headers["X-Correlation-ID"] = cid
    logger.info("request", method=request.method, path=request.url.path, status=response.status_code, elapsed_ms=int((time.time() - start) * 1000))
    return response


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/readyz")
async def readyz():
    async with engine.connect() as conn:
        await conn.execute(text("SELECT 1"))
    redis = await get_redis()
    await redis.ping()
    return {"status": "ready"}


Instrumentator().instrument(app).expose(app)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(kanoons.router, prefix=settings.api_prefix)
app.include_router(events.router, prefix=settings.api_prefix)
app.include_router(councils.router, prefix=settings.api_prefix)
app.include_router(orders.router, prefix=settings.api_prefix)
app.include_router(market.router, prefix=settings.api_prefix)
app.include_router(gallery.router, prefix=settings.api_prefix)
app.include_router(reviews.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)
