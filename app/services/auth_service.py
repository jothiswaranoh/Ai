from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.security.hash import verify_password
from app.security.jwt_handler import create_access_token

async def authenticate(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id), "email": user.email})

    return {"access_token": token, "token_type": "bearer"}
