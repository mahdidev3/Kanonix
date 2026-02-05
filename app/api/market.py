from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_role
from app.db.session import get_session
from app.models.entities import AuditLog, Event, EventType, MarketBoothRequest, Role
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/market", tags=["market"])


@router.post("/booth")
async def create_booth_request(payload: dict, session: AsyncSession = Depends(get_session), user=Depends(get_current_user), kanoon=Depends(resolve_tenant)):
    event = await session.get(Event, payload["event_id"])
    if not event or event.kanoon_id != kanoon.id or event.event_type != EventType.MARKET:
        raise HTTPException(status_code=400, detail="Invalid market event")
    if payload.get("quantity", 1) > 1 and not payload.get("extra_sellers"):
        raise HTTPException(status_code=400, detail="Extra sellers required")
    if not payload.get("terms_accepted", False):
        raise HTTPException(status_code=400, detail="Terms acceptance required")
    req = MarketBoothRequest(kanoon_id=kanoon.id, event_id=event.id, user_id=user.id, quantity=payload["quantity"], day_count=payload.get("day_count"), main_seller=payload["main_seller"], extra_sellers=payload.get("extra_sellers", []), terms_accepted=True)
    session.add(req)
    await session.commit()
    await session.refresh(req)
    return req


@router.patch("/booth/{request_id}")
async def approve_or_reject(request_id: int, payload: dict, session: AsyncSession = Depends(get_session), admin=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    req = await session.scalar(select(MarketBoothRequest).where(MarketBoothRequest.id == request_id, MarketBoothRequest.kanoon_id == kanoon.id))
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = payload["status"]
    session.add(AuditLog(kanoon_id=kanoon.id, actor_user_id=admin.id, action=f"market_booth_{req.status}", detail={"request_id": req.id}, created_at=datetime.now(timezone.utc)))
    await session.commit()
    return req
