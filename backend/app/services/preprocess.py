import os
import re
from pathlib import Path

import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


NLTK_DATA_DIR = Path(__file__).resolve().parents[2] / "nltk_data"
NLTK_DATA_DIR.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("NLTK_DATA", str(NLTK_DATA_DIR))

if str(NLTK_DATA_DIR) not in nltk.data.path:
    nltk.data.path.insert(0, str(NLTK_DATA_DIR))


def _ensure_nltk_resources():
    resources = {
        "stopwords": ["corpora/stopwords", "corpora/stopwords.zip"],
        "wordnet": ["corpora/wordnet", "corpora/wordnet.zip"],
        "omw-1.4": ["corpora/omw-1.4", "corpora/omw-1.4.zip"],
    }

    for download_name, resource_paths in resources.items():
        if not any(_resource_exists(path) for path in resource_paths):
            download_succeeded = nltk.download(
                download_name,
                download_dir=str(NLTK_DATA_DIR),
                quiet=True,
            )
            if not download_succeeded:
                raise RuntimeError(
                    f"Failed to download required NLTK resource: {download_name}"
                )

            if not any(_resource_exists(path) for path in resource_paths):
                raise RuntimeError(
                    f"Required NLTK resource is still unavailable: {download_name}"
                )


def _resource_exists(resource_path: str) -> bool:
    try:
        nltk.data.find(resource_path)
        return True
    except LookupError:
        return False


_ensure_nltk_resources()
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()


def preprocess_text(text):

    text = text.lower()

    text = re.sub(r'[^a-zA-Z\s]', '', text)

    words = text.split()

    cleaned_words = []

    for word in words:

        if word not in stop_words:

            lemma = lemmatizer.lemmatize(word)

            cleaned_words.append(lemma)

    return " ".join(cleaned_words)
