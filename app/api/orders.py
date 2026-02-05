from datetime import datetime, timedelta, timezone

import structlog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select

from app.api.deps import get_current_user, require_role
from app.db.session import DbSession
from app.models.entities import AuditLog, Event, EventType, Order, OrderStatus, Role, Seat, SeatReservation
from app.services.pricing import trip_final_price
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/orders", tags=["orders"])
logger = structlog.get_logger()


@router.post("/reserve-seat")
async def reserve_seat(payload: dict, session: DbSession, user=Depends(get_current_user), kanoon=Depends(resolve_tenant)):
    event = await session.get(Event, payload["event_id"])
    if not event or event.kanoon_id != kanoon.id or event.event_type != EventType.FESTIVAL:
        raise HTTPException(status_code=400, detail="Invalid festival event")
    seat = await session.scalar(select(Seat).where(Seat.id == payload["seat_id"], Seat.kanoon_id == kanoon.id).with_for_update())
    if not seat or seat.admin_blocked:
        raise HTTPException(status_code=400, detail="Seat unavailable")
    existing = await session.scalar(select(SeatReservation).where(SeatReservation.seat_id == seat.id, SeatReservation.expires_at > datetime.now(timezone.utc)))
    if existing:
        raise HTTPException(status_code=409, detail="Seat already reserved")
    order = Order(kanoon_id=kanoon.id, user_id=user.id, event_id=event.id, total_price=seat.price, status=OrderStatus.pending)
    session.add(order)
    await session.flush()
    reservation = SeatReservation(kanoon_id=kanoon.id, order_id=order.id, seat_id=seat.id, expires_at=datetime.now(timezone.utc) + timedelta(minutes=15))
    session.add(reservation)
    session.add(AuditLog(kanoon_id=kanoon.id, actor_user_id=user.id, action="seat_blocked", detail={"seat_id": seat.id, "order_id": order.id}, created_at=datetime.now(timezone.utc)))
    await session.commit()
    return {"order_id": order.id, "expires_at": reservation.expires_at}


@router.post("/trip")
async def create_trip_order(payload: dict, session: DbSession, user=Depends(get_current_user), kanoon=Depends(resolve_tenant)):
    event = await session.get(Event, payload["event_id"])
    if not event or event.event_type != EventType.TRIP or event.kanoon_id != kanoon.id:
        raise HTTPException(status_code=400, detail="Invalid trip event")
    previous = await session.scalar(select(func.coalesce(func.sum(Order.subsidy_applied), 0)).where(Order.user_id == user.id, Order.status == OrderStatus.paid))
    available_subsidy = max(event.subsidy_cap - float(previous), 0)
    final_price, subsidy_applied = trip_final_price(event.base_price, payload.get("quantity", 1), event.subsidy_cap, float(previous))
    gross = event.base_price * payload.get("quantity", 1)
    order = Order(kanoon_id=kanoon.id, user_id=user.id, event_id=event.id, total_price=final_price, subsidy_applied=subsidy_applied, meta={"passengers": payload.get("passengers", [])})
    session.add(order)
    session.add(AuditLog(kanoon_id=kanoon.id, actor_user_id=user.id, action="trip_subsidy_calculated", detail={"previous": float(previous), "gross": gross, "subsidy_applied": subsidy_applied, "final": final_price}, created_at=datetime.now(timezone.utc)))
    await session.commit()
    return order


@router.post("/{order_id}/pay-mock")
async def pay_mock(order_id: int, session: DbSession, user=Depends(get_current_user), kanoon=Depends(resolve_tenant)):
    order = await session.scalar(select(Order).where(Order.id == order_id, Order.user_id == user.id, Order.kanoon_id == kanoon.id))
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = OrderStatus.paid
    session.add(AuditLog(kanoon_id=kanoon.id, actor_user_id=user.id, action="payment_processed", detail={"order_id": order.id, "provider": "mock"}, created_at=datetime.now(timezone.utc)))
    await session.commit()
    return {"status": "paid"}


@router.post("/admin/release-expired")
async def release_expired(session: DbSession, _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    expired = (await session.scalars(select(SeatReservation).join(Order, Order.id == SeatReservation.order_id).where(SeatReservation.kanoon_id == kanoon.id, SeatReservation.expires_at < datetime.now(timezone.utc), Order.status == OrderStatus.pending))).all()
    ids = [res.id for res in expired]
    for res in expired:
        await session.delete(res)
    await session.commit()
    logger.info("expired_seat_released", count=len(ids))
    return {"released": ids}
