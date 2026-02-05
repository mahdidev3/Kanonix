from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_role
from app.db.session import get_session
from app.models.entities import CouncilMember, Role
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/councils", tags=["councils"])


@router.get("")
async def list_members(current: bool | None = None, session: AsyncSession = Depends(get_session), kanoon=Depends(resolve_tenant)):
    query = select(CouncilMember).where(CouncilMember.kanoon_id == kanoon.id)
    if current is not None:
        query = query.where(CouncilMember.is_current == current)
    return (await session.scalars(query)).all()


@router.post("")
async def create_member(payload: dict, session: AsyncSession = Depends(get_session), _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    member = CouncilMember(kanoon_id=kanoon.id, **payload)
    session.add(member)
    await session.commit()
    await session.refresh(member)
    return member
