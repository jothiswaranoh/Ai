from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None
    is_active: Optional[bool] = None

class UserUpdateSelf(BaseModel):
    """Limited fields that non-admin users can update"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role_id: int
    is_active: bool

class UserInDB(BaseModel):
    """User model with password hash - for internal use only"""
    id: Optional[str] = None
    name: str
    email: EmailStr
    password: str
    role_id: int
    is_active: bool = True
