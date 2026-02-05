from datetime import datetime, timedelta, timezone


def is_expired(expires_at):
    return expires_at < datetime.now(timezone.utc)


def test_seat_reservation_expiration_logic():
    assert is_expired(datetime.now(timezone.utc) - timedelta(minutes=1))
    assert not is_expired(datetime.now(timezone.utc) + timedelta(minutes=1))
