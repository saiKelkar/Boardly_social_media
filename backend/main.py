from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException, Request
from routes import UserRoutes, PostRoutes, BoardPostRoutes, BoardRoutes, FollowRoutes, LikeRoutes, TrendingRoutes
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil

from controllers.websocket_manager import manager
from db import Base, engine
import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "https://boardly-social-media.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return { "message": "API running" }

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), request: Request=None):
    try:
        file_path = UPLOAD_DIR / file.filename
        if request:
            base_url = str(request.base_url).rstrip("/")
        else:
            base_url = "https://boardly-social-media.onrender.com"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "filename": file.filename,
            "url": f"{base_url}/uploads/{file.filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)

app.include_router(UserRoutes.router)
app.include_router(PostRoutes.router)
app.include_router(BoardPostRoutes.router)
app.include_router(BoardRoutes.router)
app.include_router(FollowRoutes.router)
app.include_router(LikeRoutes.router)
app.include_router(TrendingRoutes.router)