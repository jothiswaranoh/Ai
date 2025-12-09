from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Role(BaseModel):
    id: Optional[str] = None
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

def get_role_collection(db):
    return db["roles"]
