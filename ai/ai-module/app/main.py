import cv2, time
from app.detector import detect
from app.distance import estimate_distance
from app.sender import post_detection
from app.config import TRAIN_ID, FRAME_WIDTH, FRAME_HEIGHT
from app.health import state

def run():
    cap = cv2.VideoCapture(0)
    # Using specific dimensions via cap.set
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)

    state["camera"] = cap.isOpened()

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        detections, annotated = detect(frame)

        for d in detections:
            dist = estimate_distance(d["width"])
            payload = {
                "train_id": TRAIN_ID,
                "object": str(d["cls"]),
                "confidence": d["conf"],
                "distance": dist
            }
            post_detection(payload)

        cv2.imshow("AI Detection", annotated)
        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run()
