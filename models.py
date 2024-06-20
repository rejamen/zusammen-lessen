from pydantic import BaseModel


class ProfileIn(BaseModel):
    name: str
    picture_url: str = None
    file: str = None


class ProfileOut(ProfileIn):
    id: str


class Book(BaseModel):
    name: str
    pages: int = None
    start_date: str = None
    end_date: str = None
