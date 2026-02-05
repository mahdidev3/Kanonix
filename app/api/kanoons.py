from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_role
from app.db.session import get_session
from app.models.entities import Kanoon, Role

router = APIRouter(prefix="/kanoons", tags=["kanoons"])


@router.get("")
async def list_kanoons(session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Kanoon))).all()


@router.post("")
async def create_kanoon(payload: dict, session: AsyncSession = Depends(get_session), _=Depends(require_role(Role.superadmin))):
    kanoon = Kanoon(**payload)
    session.add(kanoon)
    await session.commit()
    await session.refresh(kanoon)
    return kanoon
