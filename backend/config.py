from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GEMMA_API_KEY: str = ""
    GEMMA_MODEL: str = "gemma-4-vision-preview"

    OPENWEATHER_API_KEY: str = ""

    DATABASE_URL: str = "sqlite+aiosqlite:///./reliefiq.db"
    UPLOAD_DIR: str = "./uploads"
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_IMAGES_PER_REPORT: int = 5

    SECRET_KEY: str = "change_me_generate_a_real_secret_key"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

    ADMIN_USERNAME: str = "admin"
    # Store a bcrypt hash of the admin password in .env
    # Generate with: python -c "from passlib.context import CryptContext; print(CryptContext(['bcrypt']).hash('your_password'))"
    ADMIN_PASSWORD_HASH: str = "$2b$12$placeholder_hash_replace_this_in_env"

    CORS_ORIGINS: str = "http://localhost:5173"
    RATE_LIMIT_REPORTS_PER_HOUR: int = 10
    ENVIRONMENT: str = "development"  # "development" | "production"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
