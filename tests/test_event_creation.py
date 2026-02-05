from datetime import datetime, timezone

from app.schemas.event import EventIn
from app.models.entities import EventType


def test_event_schema_creation():
    payload = EventIn(title="A", description="B", event_type=EventType.FESTIVAL, starts_at=datetime.now(timezone.utc), ends_at=datetime.now(timezone.utc))
    assert payload.title == "A"
