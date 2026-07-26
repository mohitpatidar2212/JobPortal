from fastapi_mail import ConnectionConfig
from pydantic import BaseModel, SecretStr
from config import MAIL_FROM, MAIL_PASSWORD, MAIL_SERVER, MAIL_USERNAME, MAIL_PORT


class Settings(BaseModel):
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False


# Convert raw values from config into correct types
settings = Settings(
    MAIL_USERNAME=str(MAIL_USERNAME),
    MAIL_PASSWORD=SecretStr(str(MAIL_PASSWORD)),
    MAIL_FROM=str(MAIL_FROM),
    MAIL_PORT=int(MAIL_PORT),
    MAIL_SERVER=str(MAIL_SERVER),
)


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
