from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.config import settings
import secrets

def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_reset_token(email: str):
    """Create a password reset token with 1 hour expiration"""
    token = secrets.token_urlsafe(32)
    expire = datetime.utcnow() + timedelta(hours=1)
    payload = {
        "email": email,
        "exp": expire,
        "type": "reset"
    }
    return token, expire

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError as e:
        raise JWTError(f"Token verification failed: {str(e)}")

def verify_reset_token(token: str, stored_token: str):
    """Verify that the reset token matches and is not expired"""
    return token == stored_token

