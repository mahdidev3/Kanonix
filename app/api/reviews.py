from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.api.deps import get_current_user
from app.db.session import DbSession
from app.models.entities import Event, Order, OrderStatus, Review
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("")
async def create_review(payload: dict, session: DbSession, user=Depends(get_current_user), kanoon=Depends(resolve_tenant)):
    event = await session.scalar(select(Event).where(Event.id == payload["event_id"], Event.kanoon_id == kanoon.id))
    if not event:
        raise HTTPException(status_code=404, detail="Event missing")
    paid = await session.scalar(select(Order).where(Order.event_id == event.id, Order.user_id == user.id, Order.status == OrderStatus.paid))
    if not paid or event.state != "DONE":
        raise HTTPException(status_code=403, detail="Review not permitted")
    review = Review(kanoon_id=kanoon.id, event_id=event.id, user_id=user.id, rating=payload["rating"], comment=payload["comment"])
    session.add(review)
    await session.commit()
    return review
