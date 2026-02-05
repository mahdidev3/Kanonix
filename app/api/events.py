import structlog
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_role
from app.db.session import get_session
from app.models.entities import AuditLog, Event, EventState, EventType, Role
from app.schemas.event import EventIn
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/events", tags=["events"])
logger = structlog.get_logger()


@router.post("")
async def create_event(payload: EventIn, session: AsyncSession = Depends(get_session), user=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    event = Event(kanoon_id=kanoon.id, **payload.model_dump())
    session.add(event)
    session.add(AuditLog(kanoon_id=kanoon.id, actor_user_id=user.id, action="event_created", detail=payload.model_dump(), created_at=event.starts_at))
    await session.commit()
    await session.refresh(event)
    logger.info("event_created", event_id=event.id)
    return event


@router.get("")
async def list_events(
    session: AsyncSession = Depends(get_session),
    kanoon=Depends(resolve_tenant),
    event_type: EventType | None = None,
    state: EventState | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
):
    filters = [Event.kanoon_id == kanoon.id]
    if event_type:
        filters.append(Event.event_type == event_type)
    if state:
        filters.append(Event.state == state)
    query = select(Event).where(and_(*filters)).offset((page - 1) * page_size).limit(page_size)
    total = await session.scalar(select(func.count()).select_from(Event).where(and_(*filters)))
    items = (await session.scalars(query)).all()
    return {"total": total, "items": items}


@router.patch("/{event_id}")
async def update_event(event_id: int, payload: dict, session: AsyncSession = Depends(get_session), user=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    event = await session.scalar(select(Event).where(Event.id == event_id, Event.kanoon_id == kanoon.id))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in payload.items():
        setattr(event, key, value)
    session.add(AuditLog(kanoon_id=kanoon.id, actor_user_id=user.id, action="event_updated", detail={"event_id": event_id, "changes": payload}, created_at=event.starts_at))
    await session.commit()
    return event
