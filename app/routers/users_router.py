from fastapi import APIRouter, Depends, HTTPException
from app.db import get_db
from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse
from app.services.user_service import (
    create_user, get_user_by_id, get_all_users,
    update_user, delete_user
)

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
async def create(payload: UserCreate, db=Depends(get_db)):
    user_id = await create_user(payload.dict(), db)
    return {"id": user_id}

@router.get("/")
async def list_users(db=Depends(get_db)):
    return await get_all_users(db)
