from app.models.entities import EventState


def can_review(is_paid: bool, event_state: EventState) -> bool:
    return is_paid and event_state == EventState.DONE


def validate_market_request(quantity: int, has_extra_sellers: bool, terms_accepted: bool) -> bool:
    if not terms_accepted:
        return False
    if quantity > 1 and not has_extra_sellers:
        return False
    return True
