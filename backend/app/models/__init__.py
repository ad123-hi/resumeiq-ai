"""Models package for app (place Pydantic models here)."""

from pydantic import BaseModel


class AnalyzeResult(BaseModel):
    filename: str
    score: float
