from fastapi import FastAPI, Request, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from sqlalchemy.orm import Session
import models
import json
from database import engine, get_db

# Create database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for the frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Handle stale connections
                pass

manager = ConnectionManager()

# Global storage for the latest detection pool
latest_detections = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/detect")
async def get_detection():
    # Keep for debugging or legacy support, return the most severe detection
    global latest_detections
    if not latest_detections:
        return {"object": "None", "distance": 1000, "confidence": 0}
    return min(latest_detections, key=lambda x: x.get("distance", 1000))

@app.post("/detect")
async def post_detections(request: Request, db: Session = Depends(get_db)):
    global latest_detections
    try:
        data = await request.json()
        
        # Handle both single object and list of objects (Batching)
        detections = data.get("detections", [])
        if not detections and "object" in data:
            detections = [data]
            
        latest_detections = detections
        train_id = data.get("train_id", "unknown")

        # Save each detection to PostgreSQL
        for det in detections:
            db_log = models.DetectionLog(
                train_id=train_id,
                object_type=det.get("object", det.get("label", "None")),
                confidence=det.get("confidence", det.get("conf", 0.0)),
                distance=det.get("distance", 1000.0)
            )
            db.add(db_log)
        
        db.commit()
        
        # Push to all connected frontend clients via WebSocket
        await manager.broadcast({
            "train_id": train_id,
            "detections": detections,
            "timestamp": data.get("timestamp")
        })
        
        return {"status": "success", "count": len(detections)}
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/alert")
async def get_alert():
    global latest_detections
    if not latest_detections:
        return {"alert": "SAFE"}
    
    min_dist = min([d.get("distance", 1000) for d in latest_detections])
    if min_dist < 200: return {"alert": "DANGER"}
    if min_dist < 500: return {"alert": "WARNING"}
    return {"alert": "SAFE"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
