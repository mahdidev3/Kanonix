import asyncio
import os

from app.db.session import SessionLocal
from app.models.entities import Role, User
from app.services.security import hash_password


async def run() -> None:
    async with SessionLocal() as session:
        user = User(kanoon_id=int(os.environ.get("KANOON_ID", "1")), email=os.environ.get("ADMIN_EMAIL", "root@kanonix.local"), full_name="Root Admin", password_hash=hash_password(os.environ.get("ADMIN_PASSWORD", "ChangeMe123!")), role=Role.superadmin)
        session.add(user)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(run())
