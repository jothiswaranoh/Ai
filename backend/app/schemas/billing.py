from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PyObjectId


class BillingCreate(BaseModel):
    farmer_id: str = Field(..., description="Farmer's ID or Name")
    operator_id: str = Field(..., description="Operator's MongoDB ObjectId")
    drone_id: str = Field(default="default-drone", description="Drone's ID")
    acres: float = Field(default=0.0, ge=0)
    time: float = Field(default=0.0, ge=0, description="Duration in hours")
    amount: float = Field(..., ge=0)
    mode_type: Literal["cash", "upi"] = "cash"


class BillingUpdate(BaseModel):
    acres: Optional[float] = Field(None, ge=0)
    time: Optional[float] = Field(None, ge=0)
    amount: Optional[float] = Field(None, ge=0)
    mode_type: Optional[Literal["cash", "upi"]] = None


class BillingResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    farmer_id: str
    farmer_name: Optional[str] = None
    farmer_number: Optional[str] = None
    operator_id: str
    operator_name: Optional[str] = None
    drone_id: str
    acres: float
    time: float
    amount: float
    mode_type: Literal["cash", "upi"]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
