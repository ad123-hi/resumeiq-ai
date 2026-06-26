from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS to allow requests from your Vercel frontend and local environment
origins = [
    "https://resumeiq-ai-ochre.vercel.app",  # Your live Vercel frontend URL
    "http://localhost:3000",                 # Common port for local frontend development
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Backend is running and connected successfully!"}
