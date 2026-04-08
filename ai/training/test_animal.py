from ultralytics import YOLO
import sys
import os

def test_animal(image_path):
    # Path to your NEWLY trained model
    model_path = "runs/classify/animal_classification/railway_animals/weights/best.pt"
    
    if not os.path.exists(model_path):
        print("Model training isn't finished yet! Please wait a minute.")
        return

    # Load the model
    model = YOLO(model_path)

    # Run inference
    results = model(image_path)

    # Show results
    for result in results:
        print(f"\n--- Prediction Results ---")
        probs = result.probs
        top1_idx = probs.top1
        animal_name = result.names[top1_idx]
        confidence = probs.top1conf.item() * 100
        
        print(f"Detected Animal: {animal_name.upper()}")
        print(f"Confidence: {confidence:.2f}%")

if __name__ == "__main__":
    # You can provide an image path here to test
    sample_image = r"c:\Users\USER\Downloads\Train-Obstacle-Object-Alert-System-main\Train-Obstacle-Object-Alert-System-main\Animal Detection\animals\animals\cow\0bc9244dbf.jpg"
    test_animal(sample_image)
