from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth_schema import (
    LoginSchema, 
    ForgotPasswordRequest, 
    ResetPasswordRequest,
    PasswordChangeRequest
)
from app.schemas.users import UserCreate, UserResponse
from app.services.auth_service import (
    authenticate, 
    request_password_reset, 
    reset_password,
    change_password
)
from app.models.user_model import get_user_collection
from app.security.hash import hash_password
from app.db import get_db
from app.dependencies import get_current_active_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=dict)
async def register(payload: UserCreate, db=Depends(get_db)):
    """Register a new user"""
    users_collection = get_user_collection(db)
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    user_data = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "role_id": payload.role_id,
        "is_active": True
    }
    
    result = await users_collection.insert_one(user_data)
    
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

@router.post("/login")
async def login(payload: LoginSchema, db=Depends(get_db)):
    """Login and receive JWT token"""
    return await authenticate(payload.email, payload.password, db)

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db=Depends(get_db)):
    """Request password reset token"""
    return await request_password_reset(payload.email, db)

@router.post("/reset-password")
async def reset_password_endpoint(payload: ResetPasswordRequest, db=Depends(get_db)):
    """Reset password using token"""
    return await reset_password(payload.token, payload.new_password, db)

@router.post("/change-password")
async def change_password_endpoint(
    payload: PasswordChangeRequest,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db)
):
    """Change password for authenticated user"""
    user_id = str(current_user["_id"])
    return await change_password(user_id, payload.old_password, payload.new_password, db)

@router.post("/logout")
def logout():
    """Logout (client should delete token)"""
    return {"message": "Logged out successfully. Delete token on client side."}


