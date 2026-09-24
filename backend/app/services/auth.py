from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException, status

from app.core.security import create_access_token, create_reset_token, hash_password, verify_password
from app.enums import UserRole


async def authenticate(email: str, password: str, db) -> dict:
    """Verify credentials and return a JWT access token with user info."""
    user = await db["users"].find_one({"email": email})

    # Use the same error for wrong email or wrong password to prevent enumeration
    if not user or not verify_password(password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated",
        )

    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    role = "admin" if user.get("role_id") == UserRole.ADMIN else "operator"

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": role,
            "role_id": user["role_id"],
        },
    }


async def request_password_reset(email: str, db) -> dict:
    """
    Generate and store a password reset token.
    Always returns the same message regardless of whether the email exists,
    to prevent email-address enumeration.
    """
    user = await db["users"].find_one({"email": email})

    if user:
        token, expires_at = create_reset_token()

        # Invalidate any existing unused tokens for this email first
        await db["password_resets"].update_many(
            {"email": email, "used": False},
            {"$set": {"used": True}},
        )

        await db["password_resets"].insert_one({
            "email": email,
            "token": token,
            "expires_at": expires_at,
            "used": False,
        })

        # TODO: send_reset_email(to=email, token=token)
        # The token must NOT be returned in the response in production.

    return {"message": "If that email is registered, a reset link has been sent."}


async def reset_password(token: str, new_password: str, db) -> dict:
    """Validate the reset token and update the user's password."""
    record = await db["password_resets"].find_one({"token": token, "used": False})

    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    expires_at = record["expires_at"]
    # Normalise to UTC-aware before comparing
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > expires_at:
        # Mark as used so it cannot be replayed
        await db["password_resets"].update_one({"token": token}, {"$set": {"used": True}})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired",
        )

    hashed = hash_password(new_password)
    await db["users"].update_one(
        {"email": record["email"]},
        {"$set": {"password": hashed}},
    )
    await db["password_resets"].update_one({"token": token}, {"$set": {"used": True}})

    return {"message": "Password reset successfully"}


async def change_password(user_id: str, old_password: str, new_password: str, db) -> dict:
    """Change the authenticated user's own password."""
    user = await db["users"].find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not verify_password(old_password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )

    hashed = hash_password(new_password)
    await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed}},
    )

    return {"message": "Password changed successfully"}
