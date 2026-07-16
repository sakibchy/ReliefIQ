from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMMA_API_KEY: str = ''
    GEMMA_MODEL: str = 'gemma-4-vision-preview'
    OPENWEATHER_API_KEY: str = ''
    DATABASE_URL: str = 'sqlite+aiosqlite:///./reliefiq.db'
    UPLOAD_DIR: str = './uploads'
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_IMAGES_PER_REPORT: int = 5
    SECRET_KEY: str = 'change_me_generate_a_real_secret_key'
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    ADMIN_USERNAME: str = 'admin'
    ADMIN_PASSWORD: str = 'reliefiq_dev'
    CORS_ORIGINS: str = 'http://localhost:5173'
    RATE_LIMIT_REPORTS_PER_HOUR: int = 10
    ENVIRONMENT: str = 'development'
    
    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
