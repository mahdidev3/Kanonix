def trip_final_price(base_price: float, quantity: int, subsidy_cap: float, previous_subsidy: float) -> tuple[float, float]:
    gross = base_price * quantity
    available = max(subsidy_cap - previous_subsidy, 0)
    applied = min(available, gross)
    return gross - applied, applied
