import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS to allow requests from your Vercel frontend and local environment
origins = [
    "https://resumeiq-ai-ochre.vercel.app",
    "https://resumeiq-gk80oqwl4-adityas-projects-86eb457e.vercel.app",
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # Common alternative
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

if __name__ == "__main__":
    # Pull the port from Render's environment variables, defaulting to 10000 if local
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
