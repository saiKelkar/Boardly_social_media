from fastapi import FastAPI, WebSocket
from routes import UserRoutes, PostRoutes, BoardPostRoutes, BoardRoutes, FollowRoutes, LikeRoutes, TrendingRoutes
from fastapi.middleware.cors import CORSMiddleware
from controllers.websocket_manager import manager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return { "message": "API running" }

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