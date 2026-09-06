# AgriShield ML Inference Pipeline

## Overview
This module contains the deep learning inference service for classifying crop foliar diseases and pest infestations across 38 distinct crop-disease categories (e.g. Potato Late Blight, Tomato Early Blight, Rice Blast, Wheat Yellow Rust).

## Architecture
- **Backbone**: MobileNetV3-Large / ResNet-50 transfer learning architecture defined in `ml/model/model_architecture.py`.
- **Pre-processing**: `ml/preprocessing.py` validates file types, resizes to `224x224`, normalizes using ImageNet parameters `mean=[0.485, 0.456, 0.406]`, `std=[0.229, 0.224, 0.225]`.
- **Inference Engine**: `ml/inference.py` hot-loads `.pt` or `.pth` weights if placed into `ml/model/crop_disease_model.pt`.
- **Unified Predictor**: `ml/predictor.py` provides high-level API returning structured JSON agronomist reports.

## How to Plug in Your Trained PyTorch Weights
1. Train your model using the PlantVillage or ICAR Indian Crop Disease Dataset.
2. Save your state dictionary:
   ```python
   torch.save(model.state_dict(), "ml/model/crop_disease_model.pt")
   ```
3. Ensure class indices match `ml/model/label_encoder.json`.
4. The backend inference engine automatically detects the `.pt` file and switches from fallback to native local GPU/CPU tensor evaluation.

## Testing Prediction Locally
```bash
python3 -c "from ml.predictor import CropDiseasePredictor; p = CropDiseasePredictor(); print(p.predict('path/to/leaf.jpg'))"
```
