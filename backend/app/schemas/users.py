from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.common import PyObjectId, validate_strong_password


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str
    role_id: int = Field(..., ge=1, le=2)

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return validate_strong_password(v)


class UserUpdate(BaseModel):
    """Fields an admin may update on any user."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    role_id: Optional[int] = Field(None, ge=1, le=2)
    is_active: Optional[bool] = None


class AdminResetPassword(BaseModel):
    new_password: str

    @field_validator("new_password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return validate_strong_password(v)


class UserUpdateSelf(BaseModel):
    """Fields a non-admin user may update on their own profile."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    role_id: int
    is_active: bool

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
