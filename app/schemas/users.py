from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    role_id: Optional[int]
    is_active: Optional[bool]

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role_id: int
    is_active: bool
