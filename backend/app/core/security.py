"""
Unified security module — password hashing and JWT token handling.
"""
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings


# ─── Password hashing ─────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Return a bcrypt hash of the given plain-text password."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches the *hashed* password."""
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ─── JWT access tokens ────────────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    """Create a signed JWT with an expiry derived from settings."""
    payload = {
        **data,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT. Raises JWTError on any failure."""
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise JWTError(f"Token verification failed: {exc}") from exc


# ─── Password reset tokens ────────────────────────────────────────────────────

def create_reset_token() -> tuple[str, datetime]:
    """
    Generate a cryptographically secure random reset token.

    Returns:
        (token, expires_at) — token is a URL-safe string; expires_at is UTC-aware.
    """
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    return token, expires_at
