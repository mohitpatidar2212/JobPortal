from urllib.parse import quote_plus

username = quote_plus("mohitpatidar2212_db_user")
password = quote_plus("JobPortal@culster")

SECRET_KEY = "Pa_6eFStwfMZcmUQH_YWCuhwkzfqgSfgkjkkP8DaOP4"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
MONGO_URL = f"mongodb+srv://{username}:{password}@jobportal.e8ytjrx.mongodb.net/?appName=JobPortal"
DATABASE_NAME = "jobportal"
