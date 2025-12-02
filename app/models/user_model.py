from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int

def get_user_collection(db):
    return db["users"]
