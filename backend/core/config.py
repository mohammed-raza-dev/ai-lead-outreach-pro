from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    gemini_api_key: str = ""
    apollo_api_key: str = ""
    hunter_api_key: str = ""
    groq_api_key: str = ""
    database_url: str = "sqlite:///./data/leads.db"
    secret_key: str = "changeme"
    environment: str = "development"

    model_config = {"env_file": ".env"}

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
