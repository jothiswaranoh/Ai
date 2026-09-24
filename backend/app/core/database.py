from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """Open the MongoDB connection. Called once at application startup."""
    global _client
    _client = AsyncIOMotorClient(settings.MONGO_URL)


async def close_db() -> None:
    """Close the MongoDB connection. Called once at application shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency — returns the active database handle."""
    if _client is None:
        raise RuntimeError("Database is not connected. Ensure connect_db() was called at startup.")
    return _client[settings.DB_NAME]
