from typing import Annotated, List
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from app.db.database import engine
from app.helper.authenticate_user import authenticate
from app.routes import users, docs, websocket
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
# app.include_router(websocket.router)

@app.get("/")
async def root(username: Annotated[str, Depends(authenticate)]):
    return {"message": "Hello Aditya"}



clients: List[WebSocket] = []


@app.websocket("/ws")

async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    clients.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            print('len: ', len(clients))
            for client in clients:
                if client != websocket:  # Exclude sender
                    await client.send_text(data)

    except WebSocketDisconnect:
        clients.remove(websocket)