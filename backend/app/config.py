from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "AI Startup Idea Validator"
    secret_key: str = "change-me-before-deployment"
    database_url: str = "sqlite:///./startup_validator.db"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    frontend_origins: str = "http://localhost:5173"
    access_token_minutes: int = 120

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
