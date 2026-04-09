# Member 3 (AI/ML Engineer) - Train Obstacle Detection System

This module provides the core AI capabilities for detecting obstacles on railway tracks.

## 🎯 Objectives
- ✅ **Real-time Detection**: Uses YOLOv8 (nano) for high-speed inference.
- ✅ **Custom Mapping**: Maps standard COCO classes to railway-specific categories: `person`, `vehicle`, `animal`, `obstacle`.
- ✅ **Advanced Simulations**: Togglable Fog and Thermal vision modes for testing robustness.
- ✅ **Distance Estimation**: Calculates approximate distance to detected objects.
- ✅ **Training Pipeline**: Template provided for custom training on railway datasets.

## 🚀 How to Run (Direct AI Module)
1. Navigate to `ai/ai-module`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run the detector: `python -m app.main`.

### Keyboard Controls:
- `f`: Toggle **Fog Simulation** (Simulated blur & white overlay).
- `t`: Toggle **Thermal Vision** (Simulated heat map using OpenCV).
- `ESC`: Quit.

## 🤖 Model Training (Custom Dataset)
If you want to achieve "High Marks" by training a custom model:
1. Go to `ai/training`.
2. Prepare your images and labels in the `dataset/` folder.
   - Use **Roboflow** or **LabelImg** to annotate.
   - Label classes: `person`, `vehicle`, `animal`, `obstacle`.
3. Update `data.yaml` if necessary.
4. Run: `python train.py`.
5. Once trained, move the `best.pt` model to `ai/ai-module/models/` and update `detector.py` to point to it.

## 📊 Performance Metrics
After running `train.py`, check the `railway_detection/custom_train/` folder for:
- `results.png` (Curves for Precision, Recall, mAP).
- `confusion_matrix.png`.
- `F1_curve.png`.

## 🌫️ Simulations (OpenCV)
- **Fog**: Implemented using `cv2.addWeighted` and `cv2.GaussianBlur`.
- **Thermal**: Implemented using `cv2.applyColorMap(..., cv2.COLORMAP_JET)`.
