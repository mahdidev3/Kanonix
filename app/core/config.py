from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=f".env.{__import__('os').environ.get('APP_ENV', 'development')}", extra="ignore")

    app_env: Literal["development", "staging", "production", "test"] = Field(alias="APP_ENV")
    app_name: str = Field(alias="APP_NAME")
    api_prefix: str = Field(alias="API_PREFIX")
    secret_key: str = Field(alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = Field(alias="REFRESH_TOKEN_EXPIRE_MINUTES")

    db_host: str = Field(alias="DB_HOST")
    db_port: int = Field(alias="DB_PORT")
    db_user: str = Field(alias="DB_USER")
    db_password: str = Field(alias="DB_PASSWORD")
    db_name: str = Field(alias="DB_NAME")

    redis_url: str = Field(alias="REDIS_URL")
    allowed_origins: list[str] = Field(alias="ALLOWED_ORIGINS")
    swagger_enabled: bool = Field(alias="SWAGGER_ENABLED")
    debug: bool = Field(alias="DEBUG")
    log_level: str = Field(alias="LOG_LEVEL")
    cache_ttl_seconds: int = Field(alias="CACHE_TTL_SECONDS")
    rate_limit_per_minute: int = Field(alias="RATE_LIMIT_PER_MINUTE")
    workers: int = Field(alias="WORKERS")
    tenant_header: str = Field(alias="TENANT_HEADER")
    storage_mode: Literal["minio", "local"] = Field(alias="STORAGE_MODE")

    minio_endpoint: str | None = Field(default=None, alias="MINIO_ENDPOINT")
    minio_access_key: str | None = Field(default=None, alias="MINIO_ACCESS_KEY")
    minio_secret_key: str | None = Field(default=None, alias="MINIO_SECRET_KEY")
    minio_bucket: str | None = Field(default=None, alias="MINIO_BUCKET")
    minio_region: str | None = Field(default=None, alias="MINIO_REGION")
    local_storage_path: str = Field(default="./storage", alias="LOCAL_STORAGE_PATH")
    use_ssl: bool = Field(default=False, alias="USE_SSL")

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
