import os
from pydantic import BaseModel

class Settings(BaseModel):
    MONGO_URL: str = "mongodb://devuser:devpass123@mongodb1:27017/shamuga_drone?authSource=admin"
    DB_NAME: str = "shamuga_drone"

settings = Settings()
