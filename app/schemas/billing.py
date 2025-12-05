#The object that saves data individually to send it to backend structuredly.
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class BillingCreate(BaseModel):
    farmer_id: str = Field(..., description="MongoDB ID of the farmer as string")
    operator_id: str = Field(..., description="MongoDB ID of the operator/user as string")
    drone_id: str = Field(..., description="MongoDB ID of the drone as string")
    acres: float = Field(..., gt=0)
    time: float = Field(..., gt=0, description="Time in hours")
    amount: float = Field(..., gt=0)
    mode_type: Literal["cash", "upi"]

class BillingUpdate(BaseModel):
    acres: Optional[float] = Field(None, gt=0)
    time: Optional[float] = Field(None, gt=0)
    amount: Optional[float] = Field(None, gt=0)
    mode_type: Optional[Literal["cash", "upi"]] = None

class BillingResponse(BaseModel):
    id: str
    farmer_id: str
    operator_id: str
    drone_id: str
    acres: float
    time: float
    amount: float
    mode_type: Literal["cash", "upi"]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
