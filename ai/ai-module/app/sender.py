import time, requests
from app.config import BACKEND_URL, TRAIN_ID

_last_post = 0

def post_detection(payload: dict):
    global _last_post
    now = time.time() * 1000
    if now - _last_post < 50:  # Reduced throttle for batches
        return
    _last_post = now
    try:
        # Increased timeout slightly for batched data
        requests.post(f"{BACKEND_URL}/detect", json=payload, timeout=1.0)
    except Exception:
        pass
