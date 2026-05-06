from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Lezzet Dolu Sıfatlar API")
api_router = APIRouter(prefix="/api")


# ==================== Models ====================
class SceneResult(BaseModel):
    score: int = 0
    max_score: int = 0
    answers: List[Dict[str, Any]] = Field(default_factory=list)
    completed_at: Optional[str] = None


class StudentSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_name: str
    class_name: Optional[str] = None
    started_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    completed_at: Optional[str] = None
    total_score: int = 0
    max_score: int = 0
    scenes: Dict[str, SceneResult] = Field(default_factory=dict)


class SessionCreate(BaseModel):
    student_name: str
    class_name: Optional[str] = None


class SceneUpdate(BaseModel):
    scene: str  # "scene_1", "scene_2", "scene_3"
    score: int
    max_score: int
    answers: List[Dict[str, Any]] = Field(default_factory=list)


# ==================== Routes ====================
@api_router.get("/")
async def root():
    return {"message": "Lezzet Dolu Sıfatlar API çalışıyor"}


@api_router.post("/sessions", response_model=StudentSession)
async def create_session(payload: SessionCreate):
    session = StudentSession(
        student_name=payload.student_name.strip()[:60],
        class_name=(payload.class_name.strip()[:40] if payload.class_name else None),
    )
    doc = session.model_dump()
    await db.sessions.insert_one(doc)
    return session


@api_router.get("/sessions/{session_id}", response_model=StudentSession)
async def get_session(session_id: str):
    doc = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı")
    return StudentSession(**doc)


@api_router.put("/sessions/{session_id}/scene", response_model=StudentSession)
async def update_scene(session_id: str, payload: SceneUpdate):
    doc = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı")

    session = StudentSession(**doc)
    session.scenes[payload.scene] = SceneResult(
        score=payload.score,
        max_score=payload.max_score,
        answers=payload.answers,
        completed_at=datetime.now(timezone.utc).isoformat(),
    )
    # Recalculate totals
    session.total_score = sum(s.score for s in session.scenes.values())
    session.max_score = sum(s.max_score for s in session.scenes.values())

    await db.sessions.update_one(
        {"id": session_id},
        {"$set": session.model_dump()},
    )
    return session


@api_router.post("/sessions/{session_id}/complete", response_model=StudentSession)
async def complete_session(session_id: str):
    doc = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı")
    completed_at = datetime.now(timezone.utc).isoformat()
    await db.sessions.update_one(
        {"id": session_id},
        {"$set": {"completed_at": completed_at}},
    )
    doc["completed_at"] = completed_at
    return StudentSession(**doc)


@api_router.get("/teacher/sessions", response_model=List[StudentSession])
async def list_sessions():
    cursor = db.sessions.find({}, {"_id": 0}).sort("started_at", -1).limit(500)
    results = await cursor.to_list(500)
    return [StudentSession(**d) for d in results]


@api_router.get("/teacher/stats")
async def teacher_stats():
    cursor = db.sessions.find({}, {"_id": 0})
    all_sessions = await cursor.to_list(1000)

    total_students = len(all_sessions)
    completed = [s for s in all_sessions if s.get("completed_at")]
    total_completed = len(completed)

    avg_score = 0.0
    avg_percent = 0.0
    if completed:
        avg_score = sum(s.get("total_score", 0) for s in completed) / len(completed)
        max_totals = [s.get("max_score", 0) for s in completed if s.get("max_score", 0) > 0]
        if max_totals:
            percents = [
                (s.get("total_score", 0) / s.get("max_score", 1)) * 100
                for s in completed if s.get("max_score", 0) > 0
            ]
            avg_percent = sum(percents) / len(percents)

    # Per-scene averages
    scene_stats: Dict[str, Dict[str, float]] = {}
    for scene_key in ["scene_1", "scene_2", "scene_3", "scene_4", "scene_5"]:
        scores, maxes = [], []
        for s in all_sessions:
            sc = s.get("scenes", {}).get(scene_key)
            if sc and sc.get("max_score", 0) > 0:
                scores.append(sc.get("score", 0))
                maxes.append(sc.get("max_score", 0))
        if scores:
            scene_stats[scene_key] = {
                "avg_score": round(sum(scores) / len(scores), 2),
                "avg_max": round(sum(maxes) / len(maxes), 2),
                "participants": len(scores),
                "avg_percent": round(
                    sum((sc / mx) * 100 for sc, mx in zip(scores, maxes)) / len(scores), 1
                ),
            }
        else:
            scene_stats[scene_key] = {
                "avg_score": 0,
                "avg_max": 0,
                "participants": 0,
                "avg_percent": 0,
            }

    return {
        "total_students": total_students,
        "total_completed": total_completed,
        "avg_score": round(avg_score, 2),
        "avg_percent": round(avg_percent, 1),
        "scene_stats": scene_stats,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
