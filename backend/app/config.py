from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "School ERP API"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./school_erp.db"


settings = Settings()
