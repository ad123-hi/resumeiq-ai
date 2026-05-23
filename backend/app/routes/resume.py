import os
from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from fastapi.concurrency import run_in_threadpool
from pymongo.errors import PyMongoError

from app.config.db import get_results_collection
from app.services.extract import extract_text_from_pdf
from app.services.preprocess import preprocess_text
from app.services.similarity import calculate_similarity

router = APIRouter()

CHUNK_SIZE = 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf"}


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    if not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded.",
        )

    if not job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is required.",
        )

    file_extension = Path(resume.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF resumes are supported.",
        )

    temp_file_path = None

    try:
        with NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file_path = temp_file.name

            while chunk := await resume.read(CHUNK_SIZE):
                temp_file.write(chunk)

        extracted_text = await run_in_threadpool(
            extract_text_from_pdf,
            temp_file_path,
        )

        if not extracted_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No readable text found in the uploaded resume.",
            )

        cleaned_resume = await run_in_threadpool(preprocess_text, extracted_text)
        cleaned_job_description = await run_in_threadpool(
            preprocess_text,
            job_description,
        )

        if not cleaned_resume.strip() or not cleaned_job_description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to analyze empty resume or job description content.",
            )

        score = await run_in_threadpool(
            calculate_similarity,
            cleaned_resume,
            cleaned_job_description,
        )

        try:
            collection = get_results_collection()
            await run_in_threadpool(
                collection.insert_one,
                {
                    "filename": resume.filename,
                    "score": score,
                    "timestamp": datetime.utcnow(),
                },
            )
        except RuntimeError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(exc),
            ) from exc
        except PyMongoError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save analysis result.",
            ) from exc

        return {"filename": resume.filename, "score": score}
    finally:
        await resume.close()

        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
