from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import models
from database import engine

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

# Global storage for the latest detection
latest_detection = {
    "object": "None",
    "distance": 1000,
    "confidence": 0,
    "id": "init"
}

@app.get("/detect")
async def get_detection():
    # M1 UI Dashboard calls this via GET
    global latest_detection
    return latest_detection

@app.post("/detect")
async def post_point(request: Request):
    # M3 AI Module calls this via POST
    global latest_detection
    try:
        data = await request.json()
        latest_detection = data
        return {"status": "success", "received": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/alert")
async def get_alert():
    # Helper for alert level logic
    global latest_detection
    dist = latest_detection.get("distance", 1000)
    if dist < 200: return {"alert": "DANGER"}
    if dist < 500: return {"alert": "WARNING"}
    return {"alert": "SAFE"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
