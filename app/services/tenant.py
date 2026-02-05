from fastapi import Header, HTTPException
from sqlalchemy import select

from app.core.config import get_settings
from app.db.session import DbSession
from app.models.entities import Kanoon


async def resolve_tenant(
    session: DbSession,
    x_kanoon_slug: str | None = Header(default=None, alias=get_settings().tenant_header),
) -> Kanoon:
    if not x_kanoon_slug:
        raise HTTPException(status_code=400, detail="Missing tenant header")
    kanoon = await session.scalar(select(Kanoon).where(Kanoon.slug == x_kanoon_slug))
    if not kanoon:
        raise HTTPException(status_code=404, detail="Kanoon not found")
    return kanoon
