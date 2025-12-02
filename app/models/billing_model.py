from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class Billing(BaseModel):
    id: Optional[str] = None
    farmer_id: str
    operator_id: str
    drone_id: str
    acres: float
    time: float  # hours
    amount: float
    mode_type: Literal["cash", "upi"]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

def get_billing_collection(db):
    return db["billing"]
