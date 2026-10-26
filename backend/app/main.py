import json
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.config import settings
from app.database import Base, engine, get_db
from app.models import User, Analysis
from app.schemas import UserCreate, UserLogin, UserOut, TokenOut, IdeaCreate, AnalysisOut
from app.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from app.ai_service import generate_report

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, version="1.0.0", description="Startup idea decision-support API")
origins = [x.strip() for x in settings.frontend_origins.split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

def serialize_analysis(row: Analysis) -> dict:
    return {
        "id": row.id, "idea_name": row.idea_name, "industry": row.industry,
        "target_audience": row.target_audience, "budget": row.budget,
        "geography": row.geography, "description": row.description,
        "score": row.score, "report": json.loads(row.report_json),
        "created_at": row.created_at.isoformat() if row.created_at else datetime.now(timezone.utc).isoformat()
    }

@app.get("/")
def root():
    return {"message": "AI Startup Idea Validator API is running", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "ok", "ai_configured": bool(settings.gemini_api_key)}

@app.post("/api/auth/register", response_model=TokenOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(name=payload.name.strip(), email=email, password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    token = create_access_token(str(user.id))
    return {"access_token": token, "user": user}

@app.post("/api/auth/login", response_model=TokenOut)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"access_token": create_access_token(str(user.id)), "user": user}

@app.get("/api/auth/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user

@app.post("/api/analyses", response_model=AnalysisOut, status_code=201)
def create_analysis(payload: IdeaCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    idea = payload.model_dump()
    try:
        report = generate_report(idea)
    except Exception as exc:
        # Do not silently return a fake AI report when the configured provider fails.
        raise HTTPException(status_code=502, detail=f"AI analysis failed. Check the Gemini API key/model and try again. Details: {str(exc)[:250]}")
    row = Analysis(
        owner_id=user.id, idea_name=payload.idea_name.strip(), industry=payload.industry.strip(),
        target_audience=payload.target_audience.strip(), budget=payload.budget.strip(),
        geography=payload.geography.strip(), description=payload.description.strip(),
        score=report["score"], report_json=json.dumps(report, ensure_ascii=False)
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return serialize_analysis(row)

@app.get("/api/analyses", response_model=list[AnalysisOut])
def list_analyses(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(Analysis).filter(Analysis.owner_id == user.id).order_by(Analysis.id.desc()).limit(100).all()
    return [serialize_analysis(row) for row in rows]

@app.get("/api/analyses/{analysis_id}", response_model=AnalysisOut)
def get_analysis(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    row = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.owner_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return serialize_analysis(row)

@app.delete("/api/analyses/{analysis_id}", status_code=204)
def delete_analysis(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    row = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.owner_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(row)
    db.commit()
    return None
