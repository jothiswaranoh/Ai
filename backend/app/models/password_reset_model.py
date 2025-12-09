from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PasswordResetToken(BaseModel):
    email: str
    token: str
    expires_at: datetime
    used: bool = False

def get_password_reset_collection(db):
    return db["password_resets"]
