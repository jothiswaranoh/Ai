from fastapi import APIRouter, Depends
from app.schemas.auth_schema import LoginSchema
from app.services.auth_service import authenticate
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login(payload: LoginSchema, db=Depends(get_db)):
    return await authenticate(payload.email, payload.password, db)

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully. Delete token on client side."}

