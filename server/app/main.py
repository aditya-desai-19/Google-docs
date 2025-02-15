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

rooms = {}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    print("inisde")
    await websocket.accept()

    if client_id in rooms:
        rooms[client_id].append(websocket)
    else:
        rooms[client_id] = [websocket]

    print(len(rooms[client_id]), rooms[client_id])
    try:
        while True:
            data = await websocket.receive_text()
            for client in rooms[client_id]:
                if client != websocket:
                    await client.send_text(data)

    except WebSocketDisconnect:
        rooms[client_id].pop()