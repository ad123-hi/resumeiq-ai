from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.db import get_database_status
from app.config.settings import get_settings
from app.routes.resume import router as resume_router

settings = get_settings()
cors_origins = settings["cors_origins"] or ["*"]
cors_origin_regex = settings["cors_origin_regex"] or None

app = FastAPI(title="ResumeIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,
    allow_credentials=bool(settings["cors_origins"]),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/resume", tags=["resume"])


@app.get("/")
async def root():
    return {"status": "ok"}


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "database": get_database_status()["status"],
    }
