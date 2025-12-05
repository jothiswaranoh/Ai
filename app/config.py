import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://devuser:devpass123@mongodb1:27017/shamuga_drone?authSource=admin")
    DB_NAME: str = os.getenv("DB_NAME", "shamuga_drone")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "test")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

settings = Settings()
