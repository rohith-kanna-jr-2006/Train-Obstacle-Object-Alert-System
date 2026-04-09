import time, requests
from app.config import BACKEND_URL, TRAIN_ID

_last_post = 0

def post_detection(payload: dict):
    global _last_post
    now = time.time() * 1000
    if now - _last_post < 200:  # throttle
        return
    _last_post = now
    try:
        requests.post(f"{BACKEND_URL}/detect", json=payload, timeout=0.5)
    except Exception:
        pass
