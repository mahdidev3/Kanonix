from datetime import datetime, timezone

import structlog
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.entities import Role, User
from app.services.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
logger = structlog.get_logger()


async def get_current_user(session: AsyncSession = Depends(get_session), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = decode_token(token)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")
    user = await session.scalar(select(User).where(User.id == int(payload["sub"])))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.last_login_at = datetime.now(timezone.utc)
    await session.commit()
    logger.info("login_timestamp", user_id=user.id, last_login_at=str(user.last_login_at))
    return user


def require_role(*roles: Role):
    async def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient role")
        return user

    return checker
