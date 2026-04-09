import torch
from ultralytics import YOLO

# Detect device: GPU (CUDA) if available, otherwise CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load model and move to optimal device
model = YOLO("yolov8n.pt")
if device == "cuda":
    model.to(device)

# Mapping COCO classes to our target classes: person, vehicle, animal, obstacle
COCO_MAPPING = {
    0: "person",
    1: "vehicle", # bicycle
    2: "vehicle", # car
    3: "vehicle", # motorcycle
    5: "vehicle", # bus
    7: "vehicle", # truck
    15: "animal", # cat
    16: "animal", # dog
    17: "animal", # horse
    18: "animal", # sheep
    19: "animal", # cow
    20: "animal", # elephant
    21: "animal", # bear
    22: "animal", # zebra
    23: "animal", # giraffe
}

def detect(frame):
    results = model(frame, imgsz=640, conf=0.4, verbose=False)
    detections = []
    
    for r in results:
        for b in r.boxes:
            x1, y1, x2, y2 = b.xyxy[0].tolist()
            cls_id = int(b.cls[0])
            conf = float(b.conf[0])
            
            # Map COCO ID to our classes
            # Default to 'obstacle' for everything else detected but not specifically handled
            # or if it's explicitly identified by our custom training later
            cls_name = COCO_MAPPING.get(cls_id, "obstacle")
            
            width = x2 - x1
            detections.append({
                "label": cls_name,
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "width": width
            })
            
    return detections, results[0].plot()
