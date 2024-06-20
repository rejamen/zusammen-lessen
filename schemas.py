import os

from motor.motor_asyncio import AsyncIOMotorClient

# Retrieve MongoDB credentials from environment variables
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = int(os.getenv("MONGO_PORT"))
MONGO_DB = os.getenv("MONGO_DB")
MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

# MongoDB connection settings
MONGO_URI = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}"
DATABASE = MONGO_DB

# Connect to the MongoDB database
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE]

profile_collection = db['profiles']
