import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VitaCross API"
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    ZHIPU_API_KEY: str = os.getenv("ZHIPU_API_KEY", "")
    DATABASE_URL: str = "sqlite:///./data/vitacross_database.db"
    CHROMA_DB_DIR: str = "./data/chroma_db"
    USE_MOCK_DATA: bool = True  # Defaults to True; set to False when GOOGLE_API_KEY or ZHIPU_API_KEY is configured

    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Auto-disable mock data if any API key is set
        if self.GOOGLE_API_KEY or self.ZHIPU_API_KEY:
            self.USE_MOCK_DATA = False
        else:
            self.USE_MOCK_DATA = True

settings = Settings()
