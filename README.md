# AI Resume Analyzer

Full-stack AI Resume Analyzer built with FastAPI, React (Vite), Tailwind CSS, Framer Motion, and MongoDB.

## Project Structure

```text
AI-RESUME-ANALYZER/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config/
│   │   │   └── db.py
│   │   ├── database/
│   │   │   └── mongo.py
│   │   ├── routes/
│   │   │   └── resume.py
│   │   ├── services/
│   │   │   ├── extract.py
│   │   │   ├── preprocess.py
│   │   │   └── similarity.py
│   │   └── models/
│   ├── requirements.txt
│   ├── .env
│   ├── .gitignore
│   └── render.yaml
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
├── README.md
└── .gitignore
```

## Local Development

### Backend

```bash
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Create `frontend/.env` with:

```env
VITE_API_URL=https://your-fastapi-backend.onrender.com
```

Before deploying the frontend, verify that:

```text
GET <VITE_API_URL>/health
```

returns the ResumeIQ API health response, and that:

```text
POST <VITE_API_URL>/resume/analyze
```

is a valid endpoint on the same service.

## Environment Variables

Create `backend/.env` with:

```env
MONGO_URL=your_mongodb_atlas_connection_string
MONGO_DB_NAME=resumeiq
MONGO_COLLECTION_NAME=results
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
CORS_ORIGIN_REGEX=https://.*\.vercel\.app
```
