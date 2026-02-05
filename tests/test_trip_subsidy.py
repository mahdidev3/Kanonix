from app.services.pricing import trip_final_price


def test_trip_subsidy_logic():
    final, subsidy = trip_final_price(100, 2, 150, 20)
    assert subsidy == 130
    assert final == 70
