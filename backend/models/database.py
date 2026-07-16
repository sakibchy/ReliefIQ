import enum
import uuid
import json
from datetime import datetime
from typing import Optional, AsyncGenerator

from sqlmodel import SQLModel, Field, Column, Text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from config import settings

class ReportStatus(str, enum.Enum):
    submitted = "submitted"
    under_review = "under_review"
    aid_dispatched = "aid_dispatched"
    resolved = "resolved"

class DamageLevel(str, enum.Enum):
    none = "none"
    minor = "minor"
    moderate = "moderate"
    severe = "severe"
    catastrophic = "catastrophic"

class UrgencyScore(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class Report(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )
    status: ReportStatus = Field(default=ReportStatus.submitted)
    description: str
    description_en: Optional[str] = None
    lat: float
    lng: float
    address: Optional[str] = None
    
    # Store JSON strings in DB
    image_paths: str = Field(sa_column=Column(Text, default="[]"))
    damage_level: Optional[str] = None
    urgency_score: Optional[str] = None
    relief_items: str = Field(sa_column=Column(Text, default="[]"))
    missing_resources: str = Field(sa_column=Column(Text, default="[]"))
    ai_summary: Optional[str] = None
    confidence: Optional[float] = None
    assigned_team: Optional[str] = None
    reporter_name: Optional[str] = None
    reporter_phone: Optional[str] = None
    
    @property
    def image_paths_list(self) -> list[str]:
        return json.loads(self.image_paths) if self.image_paths else []
        
    @property
    def relief_items_list(self) -> list[str]:
        return json.loads(self.relief_items) if self.relief_items else []
        
    @property
    def missing_resources_list(self) -> list[str]:
        return json.loads(self.missing_resources) if self.missing_resources else []

engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
