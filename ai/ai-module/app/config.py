import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
TRAIN_ID = os.getenv("TRAIN_ID", "WAP7-30245")
DEVICE_ID = os.getenv("DEVICE_ID", "AI-DEVICE-001")
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
POST_INTERVAL_MS = 500  # throttle posts
