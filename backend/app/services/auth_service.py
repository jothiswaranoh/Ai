from fastapi import HTTPException
from app.models.user_model import get_user_collection
from app.models.password_reset_model import get_password_reset_collection
from app.security.hash import verify_password, hash_password
from app.security.jwt_handler import create_access_token, create_reset_token, verify_reset_token
from datetime import datetime, timezone

async def authenticate(email: str, password: str, db):
    users_collection = get_user_collection(db)
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(password, user.get("password", "")):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({
        "sub": str(user["_id"]), 
        "email": user["email"]
    })
    print(user)
    role= "admin" if user.get("role_id") ==1 else "operator"
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": role,
            "role_id": user.get("role_id")
        }
    }

async def request_password_reset(email: str, db):
    """Generate and store password reset token"""
    users_collection = get_user_collection(db)
    user = await users_collection.find_one({"email": email})
    
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a reset link will be sent"}
    
    # Generate reset token
    token, expires_at = create_reset_token(email)
    
    # Store token in database
    reset_collection = get_password_reset_collection(db)
    await reset_collection.insert_one({
        "email": email,
        "token": token,
        "expires_at": expires_at,
        "used": False
    })
    
    # In production, send email here with the token
    # For now, return the token (remove this in production)
    return {
        "message": "Password reset token generated",
        "token": token  # Remove this in production!
    }

async def reset_password(token: str, new_password: str, db):
    """Validate reset token and update password"""
    reset_collection = get_password_reset_collection(db)
    
    # Find the reset token
    reset_record = await reset_collection.find_one({
        "token": token,
        "used": False
    })
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check if token is expired
    if datetime.now(timezone.utc).replace(tzinfo=None) > reset_record["expires_at"]:
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Update user password
    users_collection = get_user_collection(db)
    hashed_password = hash_password(new_password)
    
    await users_collection.update_one(
        {"email": reset_record["email"]},
        {"$set": {"password": hashed_password}}
    )
    
    # Mark token as used
    await reset_collection.update_one(
        {"token": token},
        {"$set": {"used": True}}
    )
    
    return {"message": "Password reset successful"}

async def change_password(user_id: str, old_password: str, new_password: str, db):
    """Change password for authenticated user"""
    users_collection = get_user_collection(db)
    from bson import ObjectId
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify old password
    if not verify_password(old_password, user.get("password", "")):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    # Update to new password
    hashed_password = hash_password(new_password)
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password changed successfully"}
