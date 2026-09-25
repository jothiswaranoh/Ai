import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.common import PyObjectId


class BillingCreate(BaseModel):
    farmer_id: str = Field(..., description="Farmer's ID or Name")
    operator_id: Optional[str] = Field(default=None, description="Operator's MongoDB ObjectId")
    drone_id: str = Field(default="default-drone", description="Drone's ID")
    acres: float = Field(default=0.0, ge=0)
    time: float = Field(default=0.0, ge=0, description="Duration in hours")
    amount: float = Field(..., ge=0)
    mode_type: Literal["cash", "upi"] = "cash"

    @field_validator("time", mode="before")
    @classmethod
    def parse_time(cls, v):
        if v is None or v == "":
            return 0.0
        if isinstance(v, (int, float)):
            return float(v)
        v_str = str(v).strip().lower()
        if "min" in v_str:
            num = re.findall(r"[\d.]+", v_str)
            return round(float(num[0]) / 60.0, 2) if num else 0.0
        num = re.findall(r"[\d.]+", v_str)
        return float(num[0]) if num else 0.0


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
