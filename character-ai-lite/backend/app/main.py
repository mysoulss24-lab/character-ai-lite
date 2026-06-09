from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import characters, chats, messages, settings
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Character AI Lite API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters.router, prefix="/api/characters", tags=["characters"])
app.include_router(chats.router, prefix="/api/chats", tags=["chats"])
app.include_router(messages.router, prefix="/api/chats", tags=["messages"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Character AI Lite API"}
