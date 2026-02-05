from app.services.rules import validate_market_request


def test_market_booth_flow_rules():
    assert validate_market_request(1, False, True)
    assert not validate_market_request(2, False, True)
    assert validate_market_request(2, True, True)
    assert not validate_market_request(1, False, False)
