from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.core.security import hash_password
from app.dependencies import get_current_active_user
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
)
from app.schemas.users import UserCreate
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db=Depends(get_db)):
    """Create a new user account."""
    if await db["users"].find_one({"email": payload.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    user_data = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "role_id": payload.role_id,
        "is_active": True,
    }
    result = await db["users"].insert_one(user_data)
    return {"message": "Account created successfully", "user_id": str(result.inserted_id)}


@router.post("/login")
async def login(payload: LoginRequest, db=Depends(get_db)):
    """Authenticate with email and password, receive a JWT token."""
    return await auth_service.authenticate(payload.email, payload.password, db)


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db=Depends(get_db)):
    """Request a password reset link to be sent to the provided email."""
    return await auth_service.request_password_reset(payload.email, db)


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db=Depends(get_db)):
    """Reset password using a valid reset token."""
    return await auth_service.reset_password(payload.token, payload.new_password, db)


@router.post("/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Change the authenticated user's own password."""
    return await auth_service.change_password(
        str(current_user["_id"]),
        payload.old_password,
        payload.new_password,
        db,
    )


@router.post("/logout")
def logout():
    """
    Logout endpoint.
    JWT tokens are stateless — the client must discard the token locally.
    """
    return {"message": "Logged out successfully"}
