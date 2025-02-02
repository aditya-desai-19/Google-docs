from sqlmodel import SQLModel, Field
import uuid
from datetime import datetime, timezone
from sqlalchemy import func

class BaseModel(SQLModel):
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(),
        sa_column_kwargs={"onupdate": func.now()},
        nullable=False
    )


class User(BaseModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str

class Document(BaseModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    content: str
    user_id: uuid.UUID = Field(default=None, foreign_key="user.id")

class Shared(BaseModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    doc_id: uuid.UUID = Field(default=None, foreign_key="document.id")
    user_id: uuid.UUID = Field(default=None, foreign_key="user.id")

