from fastapi import FastAPI

app = FastAPI()
state = {"camera": False, "model": True}

@app.get("/health")
def health():
    return state
