from ultralytics import YOLO
import os

def train_animal_classifier():
    # Load YOLOv8 Classification model
    # Nano model is used for speed and edge compatibility
    model = YOLO("yolov8n-cls.pt")

    dataset_path = r"c:\Users\USER\Downloads\Train-Obstacle-Object-Alert-System-main\Train-Obstacle-Object-Alert-System-main\ai\training\animal_dataset"

    print("Starting Animal Classification Training...")
    
    # Train the model
    # imgsz=224 is standard for classification
    results = model.train(
        data=dataset_path,
        epochs=30,
        imgsz=224,
        project="animal_classification",
        name="railway_animals",
        device='cpu' # Use 'cpu' for safety, change to 0 if GPU available
    )

    print("Training Finished!")
    print(f"Model saved to: {results.save_dir}")

if __name__ == "__main__":
    train_animal_classifier()
