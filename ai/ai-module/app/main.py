import cv2, time
from app.detector import detect
from app.distance import estimate_distance
from app.sender import post_detection
from app.config import TRAIN_ID, FRAME_WIDTH, FRAME_HEIGHT
from app.health import state
from app.augmentation import apply_fog, apply_thermal

def run():
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)

    state["camera"] = cap.isOpened()
    mode = "normal"

    print("--- AI Detector Running ---")
    print("Press 'f' to toggle Fog Simulation")
    print("Press 't' to toggle Thermal Simulation")
    print("Press 'ESC' to exit")

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        # Advanced Simulations (Optional Member 3 Features)
        if mode == "fog":
            frame = apply_fog(frame)
        elif mode == "thermal":
            frame = apply_thermal(frame)

        detections, annotated = detect(frame)

        for d in detections:
            dist = estimate_distance(d["width"])
            payload = {
                "train_id": TRAIN_ID,
                "object": d["label"],
                "confidence": round(d["conf"], 2),
                "distance": dist
            }
            post_detection(payload)

        # Draw Simulation Mode Label on screen
        cv2.putText(annotated, f"Mode: {mode}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)

        cv2.imshow("AI Detection System", annotated)
        key = cv2.waitKey(1) & 0xFF
        if key == 27: # ESC
            break
        elif key == ord('f'):
            mode = "fog" if mode != "fog" else "normal"
        elif key == ord('t'):
            mode = "thermal" if mode != "thermal" else "normal"

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run()
