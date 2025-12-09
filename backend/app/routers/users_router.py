from fastapi import APIRouter, Depends, HTTPException, Query
from app.db import get_db
from app.schemas.users import UserCreate, UserUpdate, UserUpdateSelf, UserResponse
from app.services.user_service import (
    create_user, get_user_by_id, get_all_users,
    update_user, delete_user, get_user_by_email
)
from app.dependencies import (
    get_current_active_user,
    admin_required
)
from app.security.hash import hash_password

router = APIRouter(prefix="/users", tags=["Users"])

# Profile endpoints (accessible by authenticated users)
@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current user's profile"""
    return current_user

@router.put("/me", response_model=dict)
async def update_my_profile(
    payload: UserUpdateSelf,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db)
):
    """Update current user's profile (limited fields)"""
    user_id = str(current_user["_id"])
    
    # Check if email is being changed and if it's already taken
    if payload.email and payload.email != current_user.get("email"):
        existing_user = await get_user_by_email(payload.email, db)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    update_data = payload.dict(exclude_unset=True)
    success = await update_user(user_id, update_data, db)
    
    if not success:
        raise HTTPException(status_code=400, detail="Update failed")
    
    return {"message": "Profile updated successfully"}

# Admin-only endpoints
@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: dict = Depends(admin_required),
    db=Depends(get_db)
):
    """Get all users (admin only) with pagination"""
    users = await get_all_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db)
):
    """Get user by ID (admin or self)"""
    # Check if user is accessing own data or is admin
    is_admin = current_user.get("role_id") == 1
    is_self = str(current_user["_id"]) == user_id
    
    if not (is_admin or is_self):
        raise HTTPException(status_code=403, detail="Access denied")
    
    user = await get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.put("/{user_id}", response_model=dict)
async def update_user_endpoint(
    user_id: str,
    payload: UserUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db)
):
    """Update user (admin: all fields, user: limited fields for self)"""
    is_admin = current_user.get("role_id") == 1
    is_self = str(current_user["_id"]) == user_id
    
    if not (is_admin or is_self):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Non-admin users can only update limited fields
    if not is_admin and is_self:
        # Only allow name and email updates for non-admin
        if payload.role_id is not None or payload.is_active is not None:
            raise HTTPException(
                status_code=403, 
                detail="You can only update your name and email"
            )
    
    # Check if email is being changed and if it's already taken
    if payload.email:
        existing_user = await get_user_by_email(payload.email, db)
        if existing_user and str(existing_user["_id"]) != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    update_data = payload.dict(exclude_unset=True)
    success = await update_user(user_id, update_data, db)
    
    if not success:
        raise HTTPException(status_code=404, detail="User not found or update failed")
    
    return {"message": "User updated successfully"}

@router.delete("/{user_id}", response_model=dict)
async def delete_user_endpoint(
    user_id: str,
    current_user: dict = Depends(admin_required),
    db=Depends(get_db)
):
    """Delete user (admin only)"""
    # Prevent admin from deleting themselves
    if str(current_user["_id"]) == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    success = await delete_user(user_id, db)
    
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

