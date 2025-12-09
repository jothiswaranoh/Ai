from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    password: str
    role_id: int
    is_active: bool = True

def get_user_collection(db):
    return db["users"]
