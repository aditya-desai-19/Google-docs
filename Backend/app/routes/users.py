from fastapi import APIRouter, Depends
from app.db.database import get_session
from app.helper.authenticate_user import authenticate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.db.models import User

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(authenticate)])


@router.get("/")
async def get_users(session=Depends(get_session)):
    result = await session.execute(select(User))
    return result.scalars().all()


@router.post("/create")
async def create_user(user: User, session: AsyncSession = Depends(get_session)):
    print(user)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user