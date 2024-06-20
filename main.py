import boto3
import os

from bson import ObjectId
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ProfileIn, ProfileOut, Book
from schemas import profile_collection
from typing import List
from utils import (
    get_signed_url_from_key,
    get_signed_urls_for_bucket,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_profile_from_db(profile_id: str):
    try:
        object_id = ObjectId(profile_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    profile = await profile_collection.find_one({"_id": object_id})
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile["_id"] = str(profile["_id"])
    profile["picture_url"] = get_signed_url_from_key(profile["picture_url"])
    return profile


@app.get("/profile")
async def home_page():
    profiles = await profile_collection.find().to_list(length=None)
    for profile in profiles:
        profile["_id"] = str(profile["_id"])
        profile["picture_url"] = get_signed_url_from_key(profile["picture_url"])
    return {"profiles": profiles}


@app.get("/profile/{profile_id}")
async def get_profile(profile: dict = Depends(get_profile_from_db)):
    return profile

@app.post("/profile")
async def add_profile(profile: ProfileIn):
    await profile_collection.insert_one(profile.dict())
    return {"message": "Profile added successfully!"}


@app.get("/profile/library")
def get_picture_library():
    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    urls = get_signed_urls_for_bucket(AWS_BUCKET_NAME)
    return {'pictures': urls}

@app.post("/profile/{profile_id}/add-book")
async def profile_add_book(profile_id: str, book: Book):
    try:
        object_id = ObjectId(profile_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    await profile_collection.update_one(
        {"_id": object_id},
        {"$push": {"books": book.dict()}}
    )
    return book.dict()

