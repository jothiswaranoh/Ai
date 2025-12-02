from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "Hardtofind"  # move to .env
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
