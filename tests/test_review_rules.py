from app.models.entities import EventState
from app.services.rules import can_review


def test_review_requires_paid_and_done():
    assert can_review(True, EventState.DONE)
    assert not can_review(False, EventState.DONE)
    assert not can_review(True, EventState.ACTIVE)
