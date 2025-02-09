from fastapi import APIRouter, Depends
from app.helper.authenticate_user import authenticate
from app.db.models import Document
from app.db.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

router = APIRouter(prefix="/docs", tags=["docs"], dependencies=[Depends(authenticate)])

@router.get("/")
async def get_docs(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Document))
    #scalars() fun is used to remove tuple instances and get only Model instances
    return result.scalars().all()

@router.post("/create")
async def create_doc(doc: Document, session: AsyncSession = Depends(get_session)):
    session.add(doc)
    await session.commit()
    await session.refresh(doc)
    return doc

