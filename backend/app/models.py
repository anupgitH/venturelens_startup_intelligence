from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="owner", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    idea_name: Mapped[str] = mapped_column(String(160))
    industry: Mapped[str] = mapped_column(String(100))
    target_audience: Mapped[str] = mapped_column(String(500))
    budget: Mapped[str] = mapped_column(String(100))
    geography: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    score: Mapped[int] = mapped_column(Integer)
    report_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    owner: Mapped[User] = relationship(back_populates="analyses")
