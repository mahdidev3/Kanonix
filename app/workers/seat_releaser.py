import asyncio
from datetime import datetime, timezone

import structlog
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.entities import Order, OrderStatus, SeatReservation

logger = structlog.get_logger()


async def run_once() -> int:
    async with SessionLocal() as session:
        expired = (await session.scalars(select(SeatReservation).join(Order, Order.id == SeatReservation.order_id).where(SeatReservation.expires_at < datetime.now(timezone.utc), Order.status == OrderStatus.pending))).all()
        count = len(expired)
        for row in expired:
            await session.delete(row)
        await session.commit()
        logger.info("seat_releaser", released=count)
        return count


async def loop() -> None:
    while True:
        await run_once()
        await asyncio.sleep(30)


if __name__ == "__main__":
    asyncio.run(loop())
