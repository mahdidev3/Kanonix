from fastapi import APIRouter, Depends
from sqlalchemy import select

from app.api.deps import require_role
from app.db.session import DbSession
from app.models.entities import Kanoon, Role

router = APIRouter(prefix="/kanoons", tags=["kanoons"])


@router.get("")
async def list_kanoons(session: DbSession):
    return (await session.scalars(select(Kanoon))).all()


@router.post("")
async def create_kanoon(payload: dict, session: DbSession, _=Depends(require_role(Role.superadmin))):
    kanoon = Kanoon(**payload)
    session.add(kanoon)
    await session.commit()
    await session.refresh(kanoon)
    return kanoon
