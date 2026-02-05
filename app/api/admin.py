import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_role
from app.db.session import get_session
from app.models.entities import Event, Order, OrderStatus, Role, SeatReservation
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/reports/sales")
async def sales_report(session: AsyncSession = Depends(get_session), _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    rows = (await session.execute(select(Event.title, func.coalesce(func.sum(Order.total_price), 0)).join(Order, Order.event_id == Event.id).where(Event.kanoon_id == kanoon.id, Order.status == OrderStatus.paid).group_by(Event.title))).all()
    return [{"event": r[0], "sales": float(r[1])} for r in rows]


@router.get("/reports/sales.csv")
async def sales_report_csv(session: AsyncSession = Depends(get_session), _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    data = await sales_report(session, _, kanoon)
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=["event", "sales"])
    writer.writeheader()
    writer.writerows(data)
    return StreamingResponse(iter([buffer.getvalue()]), media_type="text/csv")


@router.get("/reports/attendees")
async def attendee_report(session: AsyncSession = Depends(get_session), _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    rows = (await session.execute(select(Order.event_id, func.count(Order.id)).where(Order.kanoon_id == kanoon.id, Order.status == OrderStatus.paid).group_by(Order.event_id))).all()
    return [{"event_id": event_id, "attendees": c} for event_id, c in rows]


@router.get("/reports/seat-status")
async def seat_status(session: AsyncSession = Depends(get_session), _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    reserved = await session.scalar(select(func.count(SeatReservation.id)).where(SeatReservation.kanoon_id == kanoon.id))
    return {"reserved_seats": reserved}
