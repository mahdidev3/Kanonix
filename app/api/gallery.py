from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.deps import require_role
from app.db.session import DbSession
from app.models.entities import GalleryItem, Role
from app.services.storage import save_file
from app.services.tenant import resolve_tenant

router = APIRouter(prefix="/gallery", tags=["gallery"])


@router.post("/upload")
async def upload(session: DbSession, event_id: int = Form(...), title: str = Form(""), file: UploadFile = File(...), _=Depends(require_role(Role.admin, Role.superadmin)), kanoon=Depends(resolve_tenant)):
    path = await save_file(file)
    item = GalleryItem(kanoon_id=kanoon.id, event_id=event_id, file_url=path, title=title)
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item
