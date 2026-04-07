from ultralytics import YOLO

model = YOLO("models/yolov8n.pt")

def detect(frame):
    results = model(frame, imgsz=640, conf=0.4)
    detections = []
    for r in results:
        for b in r.boxes:
            x1, y1, x2, y2 = b.xyxy[0].tolist()
            cls = int(b.cls[0])
            conf = float(b.conf[0])
            width = x2 - x1
            detections.append({
                "cls": cls,
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "width": width
            })
    return detections, results[0].plot()
