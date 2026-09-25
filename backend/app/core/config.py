from pathlib import Path
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE_PATH = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    # ─── Database ─────────────────────────────────────────────────────────────
    MONGO_URL: str = Field(
        ...,
        validation_alias=AliasChoices("MONGO_URL", "MONGO_URI"),
        description="MongoDB connection string",
    )
    DB_NAME: str = Field(..., description="Database name")

    # ─── JWT ──────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = Field(
        ...,
        min_length=32,
        description="JWT signing secret — must be at least 32 characters",
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080  # 7 days (7 * 24 * 60 minutes)

    # ─── CORS ─────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = (
        "http://localhost:3000,http://localhost:5173,http://localhost:4173,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:4173,"
        "https://shamuga.zeal.lol,http://shamuga.zeal.lol"
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        """Return ALLOWED_ORIGINS split on commas, stripping whitespace."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE_PATH), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

