from fastapi_mail import ConnectionConfig
from pydantic import BaseModel, SecretStr

class Settings(BaseModel):
    MAIL_USERNAME: str = "mohitpatidar83054@gmail.com"
    MAIL_PASSWORD: SecretStr = SecretStr("jkpnqsqhnpudjcuc")
    MAIL_FROM: str = "mohitpatidar83054@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False


settings = Settings()

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,  
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True
)
