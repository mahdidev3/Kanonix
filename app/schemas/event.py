from datetime import datetime

from pydantic import BaseModel

from app.models.entities import EventState, EventType


class EventIn(BaseModel):
    title: str
    description: str
    event_type: EventType
    state: EventState = EventState.DRAFT
    starts_at: datetime
    ends_at: datetime
    base_price: float = 0
    subsidy_cap: float = 0


class EventOut(EventIn):
    id: int
