import os
import shutil
import random

# Configuration
SOURCE_DIR = r"c:\Users\USER\Downloads\Train-Obstacle-Object-Alert-System-main\Train-Obstacle-Object-Alert-System-main\Animal Detection\animals\animals"
TARGET_DIR = r"c:\Users\USER\Downloads\Train-Obstacle-Object-Alert-System-main\Train-Obstacle-Object-Alert-System-main\ai\training\animal_dataset"

# Animals most relevant to railway tracks
RELEVANT_ANIMALS = ["cow", "dog", "horse", "elephant", "goat", "donkey", "pig", "sheep", "deer"]

def prepare_dataset():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)

    for split in ['train', 'val']:
        for animal in RELEVANT_ANIMALS:
            os.makedirs(os.path.join(TARGET_DIR, split, animal), exist_ok=True)

    for animal in RELEVANT_ANIMALS:
        animal_path = os.path.join(SOURCE_DIR, animal)
        if not os.path.exists(animal_path):
            print(f"Skipping {animal}, path not found.")
            continue

        images = [f for f in os.listdir(animal_path) if f.endswith(('.jpg', '.png', '.jpeg'))]
        random.shuffle(images)

        # 80/20 Split
        split_idx = int(len(images) * 0.8)
        train_objs = images[:split_idx]
        val_objs = images[split_idx:]

        print(f"Copying {animal}: {len(train_objs)} train, {len(val_objs)} val")

        for img in train_objs:
            shutil.copy(os.path.join(animal_path, img), os.path.join(TARGET_DIR, 'train', animal, img))
        for img in val_objs:
            shutil.copy(os.path.join(animal_path, img), os.path.join(TARGET_DIR, 'val', animal, img))

    print(f"\nDataset prepared at: {TARGET_DIR}")

if __name__ == "__main__":
    prepare_dataset()
