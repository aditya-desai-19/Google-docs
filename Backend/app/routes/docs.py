from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.helper.authenticate_user import authenticate

router = APIRouter(prefix="/docs", tags=["docs"], dependencies=[Depends(authenticate)])

class Doc(BaseModel):
    name: str

@router.get("/")
async def get_docs():
    return {"message": "list of docs"}

@router.post("/create")
async def create_doc(body: Doc):
    #Todo insert a record in users table
    print("inside create doc")
    return body.name

