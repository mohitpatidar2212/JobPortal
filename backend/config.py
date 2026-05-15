# config.py

import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
import sys # For better error logging to Vercel's stderr

# Load variables from .env file (for local testing only)
load_dotenv() 

MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "").strip() 
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "").strip() 
MONGO_HOST = os.environ.get("MONGO_HOST", "jobportal.e8ytjrx.mongodb.net").strip()
DATABASE_NAME = os.environ.get("DATABASE_NAME", "jobportal").strip()
# --- Database Config: Assemble the connection string ---
# Escape the password using quote_plus
ESCAPED_PASSWORD = quote_plus(MONGO_PASSWORD)

# --- Database Config: Assemble the connection string ---
MONGO_URL = f"mongodb+srv://{MONGO_USERNAME}:{ESCAPED_PASSWORD}@{MONGO_HOST}/?appName=JobPortal"


# --- Security Config ---
SECRET_KEY = os.environ.get("SECRET_KEY") 
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# --- Email Config (ADJUSTED) ---
MAIL_USERNAME: str = os.environ.get("MAIL_USERNAME", "").strip()
MAIL_PASSWORD: str = os.environ.get("MAIL_PASSWORD", "").strip()
MAIL_FROM: str = os.environ.get("MAIL_FROM", "").strip()
MAIL_PORT: int = int(os.environ.get("MAIL_PORT", 587))
MAIL_SERVER: str = os.environ.get("MAIL_SERVER", "smtp.gmail.com")


if not MONGO_USERNAME:
    raise ValueError("FATAL: MONGO_USERNAME is missing from Vercel Environment Variables.")
if not MONGO_PASSWORD:
    raise ValueError("FATAL: MONGO_PASSWORD is missing from Vercel Environment Variables.")
if not SECRET_KEY:
    raise ValueError("FATAL: SECRET_KEY is missing from Vercel Environment Variables.")

if not MAIL_USERNAME or not MAIL_PASSWORD:
    raise ValueError("FATAL: MAIL_USERNAME or MAIL_PASSWORD is missing from Vercel Environment Variables.")

