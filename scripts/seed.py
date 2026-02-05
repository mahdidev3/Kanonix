import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.entities import Event, EventState, EventType, Hall, Kanoon, Role, Seat, User
from app.services.security import hash_password


async def seed() -> None:
    async with SessionLocal() as session:
        kanoon = await session.scalar(select(Kanoon).where(Kanoon.slug == "arya"))
        if not kanoon:
            kanoon = Kanoon(slug="arya", name="Arya Kanoon", contact_info={"phone": "+989000000000"}, social_links={"instagram": "@arya"}, about_text="Student cultural kanoon", rules_text="Follow university rules")
            session.add(kanoon)
            await session.flush()
        superadmin = await session.scalar(select(User).where(User.email == "admin@arya.local"))
        if not superadmin:
            session.add(User(kanoon_id=kanoon.id, email="admin@arya.local", full_name="Arya Admin", password_hash=hash_password("Admin@12345"), role=Role.superadmin))
        hall_names = ["Sheikh-Bahaei", "Fotouhi", "Honar Hall", "Mofakher Hall"]
        halls = []
        for name in hall_names:
            hall = await session.scalar(select(Hall).where(Hall.kanoon_id == kanoon.id, Hall.name == name))
            if not hall:
                hall = Hall(kanoon_id=kanoon.id, name=name)
                session.add(hall)
                await session.flush()
                for row in ["A", "B", "C"]:
                    for col in range(1, 6):
                        session.add(Seat(kanoon_id=kanoon.id, hall_id=hall.id, row_label=row, col_number=col, seat_label=f"{row}{col}", price=100000, gender_restriction="any"))
            halls.append(hall)
        if not await session.scalar(select(Event).where(Event.kanoon_id == kanoon.id)):
            now = datetime.now(timezone.utc)
            session.add_all([
                Event(kanoon_id=kanoon.id, title="Winter Festival", description="festival", event_type=EventType.FESTIVAL, state=EventState.ACTIVE, starts_at=now + timedelta(days=10), ends_at=now + timedelta(days=11), base_price=100000, subsidy_cap=0),
                Event(kanoon_id=kanoon.id, title="North Trip", description="trip", event_type=EventType.TRIP, state=EventState.ACTIVE, starts_at=now + timedelta(days=20), ends_at=now + timedelta(days=22), base_price=800000, subsidy_cap=300000),
                Event(kanoon_id=kanoon.id, title="Spring Market", description="market", event_type=EventType.MARKET, state=EventState.ACTIVE, starts_at=now + timedelta(days=30), ends_at=now + timedelta(days=31), base_price=200000, subsidy_cap=0),
            ])
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
