from app.services.security import create_token, decode_token, hash_password, verify_password


def test_password_hashing():
    hashed = hash_password("Secure@123")
    assert verify_password("Secure@123", hashed)


def test_jwt_roundtrip():
    token = create_token("1", "access", 30)
    payload = decode_token(token)
    assert payload["sub"] == "1"
