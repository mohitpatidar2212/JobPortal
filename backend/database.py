from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL, DATABASE_NAME

print(f"DEBUG: Attempting connection with URL start: {MONGO_URL[:40]}...")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
