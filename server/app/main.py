from typing import Annotated
from fastapi import FastAPI, Depends
from app.db.database import engine
from app.helper.authenticate_user import authenticate
from app.routes import users, docs
from contextlib import asynccontextmanager
from sqlmodel import SQLModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(users.router)
app.include_router(docs.router)

@app.get("/")
async def root(username: Annotated[str, Depends(authenticate)]):
    return {"message": "Hello Aditya"}
