from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_token(subject: str, token_type: str, minutes: int) -> str:
    payload = {
        "sub": subject,
        "type": token_type,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=["HS256"])
