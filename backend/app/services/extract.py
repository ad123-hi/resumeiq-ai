from pathlib import Path

import fitz


def extract_text_from_pdf(pdf_path: str | Path) -> str:
    """Extract all text from a PDF file path using PyMuPDF."""
    document_path = Path(pdf_path)
    extracted_pages: list[str] = []

    with fitz.open(document_path) as document:
        for page in document:
            extracted_pages.append(page.get_text())

    return "".join(extracted_pages)
