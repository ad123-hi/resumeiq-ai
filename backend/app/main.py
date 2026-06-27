from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.db import get_database_status
from app.config.settings import get_settings
from app.routes.resume import router as resume_router

settings = get_settings()

# Fallback values if environment variables are missing
cors_origins = settings.get("cors_origins") or [
    "http://localhost:3000",
    "https://resumeiq-ai-ochre.vercel.app"
]

# This regex matches your current Vercel project and any future deployment previews
cors_origin_regex = settings.get("cors_origin_regex") or r"https://resumeiq-.*\.vercel\.app"

app = FastAPI(title="ResumeIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,  # Allows dynamic Vercel URLs
    allow_credentials=True,
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
