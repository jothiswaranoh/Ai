import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import get_db
from app.core.security import hash_password
from app.dependencies import admin_required, get_current_active_user
from app.enums import UserRole
from app.schemas.users import AdminResetPassword, UserCreate, UserResponse, UserUpdate, UserUpdateSelf
from app.services import users as user_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_active_user)):
    """Return the current user's profile."""
    return current_user


@router.put("/me", response_model=dict)
async def update_my_profile(
    payload: UserUpdateSelf,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Update the current user's profile (name and email only)."""
    update_data = payload.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"] != current_user.get("email"):
        if await user_service.get_user_by_email(update_data["email"], db):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already in use",
            )

    await user_service.update_user(str(current_user["_id"]), update_data, db)
    return {"message": "Profile updated successfully"}


# ─── Admin-only endpoints ─────────────────────────────────────────────────────

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    current_user: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """Create a new user (admin only)."""
    if await user_service.get_user_by_email(payload.email, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    now = datetime.now(timezone.utc)
    user_data = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "role_id": payload.role_id,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
        "created_by": str(current_user["_id"]),
    }
    user_id = await user_service.create_user(user_data, db)
    return await user_service.get_user_by_id(user_id, db)


@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """List all users with pagination (admin only)."""
    return await user_service.get_all_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Get a user by ID. Accessible by admins or the user themselves."""
    is_admin = current_user.get("role_id") == UserRole.ADMIN
    is_self = str(current_user["_id"]) == user_id

    if not (is_admin or is_self):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    user = await user_service.get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user


@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    payload: UserUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """
    Update a user.
    - Admins may change all fields (name, email, role_id, is_active).
    - Non-admins may only update their own name and email.
    """
    is_admin = current_user.get("role_id") == UserRole.ADMIN
    is_self = str(current_user["_id"]) == user_id

    if not (is_admin or is_self):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    update_data = payload.model_dump(exclude_unset=True)

    if not is_admin:
        restricted = {k for k in update_data if k in {"role_id", "is_active"}}
        if restricted:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You cannot update restricted field(s): {', '.join(restricted)}",
            )

    if "email" in update_data:
        existing = await user_service.get_user_by_email(update_data["email"], db)
        if existing and str(existing["_id"]) != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already in use",
            )

    success = await user_service.update_user(user_id, update_data, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or no changes were made",
        )

    return {"message": "User updated successfully"}


@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """Delete a user (admin only). Admins cannot delete their own account."""
    if str(current_user["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )

    success = await user_service.delete_user(user_id, db)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    logger.info("Admin %s deleted user %s", current_user["_id"], user_id)
    return {"message": "User deleted successfully"}


@router.post("/{user_id}/reset-password", response_model=dict)
async def admin_reset_password(
    user_id: str,
    payload: AdminResetPassword,
    current_user: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """Admin resets any user/operator's password directly."""
    hashed = hash_password(payload.new_password)
    now = datetime.now(timezone.utc)
    success = await user_service.update_user(user_id, {"password": hashed, "updated_at": now}, db)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    logger.info("Admin %s reset password for user %s", current_user["_id"], user_id)
    return {"message": "User password reset successfully"}
