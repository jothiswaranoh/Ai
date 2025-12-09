
from app.schemas.common import PyObjectId
from pydantic import BaseModel, EmailStr, Field, ConfigDict
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
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    role_id: int
    is_active: bool

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class UserInDB(BaseModel):
    """User model with password hash - for internal use only"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    password: str
    role_id: int
    is_active: bool = True
