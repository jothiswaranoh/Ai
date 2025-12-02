from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Farmer(BaseModel):
    id: Optional[str] = None
    name: str
    number: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

def get_farmer_collection(db):
    return db["farmers"]
