from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.security.jwt_handler import verify_token
from app.models.user_model import User
from app.db import get_db

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        data = verify_token(token)
    except:
        raise HTTPException(401, "Invalid or expired token")

    user = db.query(User).get(int(data["sub"]))
    if not user:
        raise HTTPException(401, "User not found")

    return user

def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role_id != 1:  # assuming '1' = admin role
        raise HTTPException(403, "Admin access required")
    return current_user