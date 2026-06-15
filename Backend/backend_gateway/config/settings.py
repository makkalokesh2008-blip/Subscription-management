from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    API_V1_PREFIX: str = "/api"
    SPRING_BOOT_URL: str = "http://localhost:8080"
    NODE_SEARCH_URL: str = "http://localhost:5000"
    CORS_ORIGINS: List[str] = ["*"]
    LOG_LEVEL: str = "INFO"
    HEALTH_CHECK_PATH: str = "/health"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
