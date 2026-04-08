from ultralytics import YOLO
import os

# Training script for Member 3 (AI/ML Engineer)

def train_custom_model(data_yaml_path="data.yaml", epochs=50, imgsz=640):
    """
    Trains a custom YOLOv8 model for railway obstacle detection.
    Prepares for: person, vehicle, animal, obstacle.
    """
    
    # Load pretrained model (Start with nano model for speed/efficiency)
    model = YOLO("yolov8n.pt")
    
    # Step 4 from USER_REQUEST: Train Model
    print(f"Starting training on {data_yaml_path}...")
    
    # Results will be saved under runs/detect/train
    results = model.train(
        data=data_yaml_path,
        epochs=epochs,
        imgsz=imgsz,
        project="railway_detection",
        name="custom_train",
        device=0 # Change to 'cpu' if no GPU is available
    )
    
    print("Training Complete!")
    print(f"Best model saved at: {os.path.abspath(results.save_dir)}/weights/best.pt")
    
if __name__ == "__main__":
    # Ensure dataset structure exists if this is being run for the first time
    # This is a sample run, Member 3 should have data.yaml ready
    train_custom_model()
