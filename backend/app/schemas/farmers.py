from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PyObjectId


class FarmerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    number: str = Field(..., min_length=5, max_length=20)
    location: Optional[str] = Field(None, max_length=200)


class FarmerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    number: Optional[str] = Field(None, min_length=5, max_length=20)
    location: Optional[str] = Field(None, max_length=200)


class FarmerResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    number: str
    location: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
