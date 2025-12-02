from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DroneDetail(BaseModel):
    id: Optional[str] = None
    name: str
    model: Optional[str] = None
    serial_number: Optional[str] = None
    per_hour_rate: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

def get_drone_collection(db):
    return db["drone_details"]
