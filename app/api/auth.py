from datetime import datetime, timezone

import structlog
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_session
from app.models.entities import User
from app.schemas.auth import LoginIn, RegisterIn, TokenOut
from app.services.security import create_token, hash_password, verify_password
from app.services.tenant import resolve_tenant
from app.utils.rate_limit import rate_limit

router = APIRouter(prefix="/auth", tags=["auth"])
logger = structlog.get_logger()


@router.post("/register", response_model=TokenOut)
async def register(payload: RegisterIn, request: Request, session: AsyncSession = Depends(get_session), kanoon=Depends(resolve_tenant)):
    await rate_limit(request, "auth-register")
    existing = await session.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=400, detail="Email exists")
    user = User(
        kanoon_id=kanoon.id,
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return TokenOut(
        access_token=create_token(str(user.id), "access", 30),
        refresh_token=create_token(str(user.id), "refresh", 60 * 24),
    )


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, request: Request, session: AsyncSession = Depends(get_session), kanoon=Depends(resolve_tenant)):
    await rate_limit(request, "auth-login")
    user = await session.scalar(select(User).where(User.email == payload.email, User.kanoon_id == kanoon.id))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user.last_login_at = datetime.now(timezone.utc)
    await session.commit()
    logger.info("user_login", user_id=user.id, kanoon_id=kanoon.id)
    return TokenOut(
        access_token=create_token(str(user.id), "access", 30),
        refresh_token=create_token(str(user.id), "refresh", 60 * 24),
    )


@router.get("/profile")
async def profile(user=Depends(get_current_user)):
    return user
