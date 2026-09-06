"""
AgriShield - Machine Learning Pipeline
Module: inference.py
Loads model weights (.pt / .pth) and runs forward pass on preprocessed tensor.
"""

import os
import json
from typing import Dict, Any, Optional

WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), 'model', 'crop_disease_model.pt')
LABELS_PATH = os.path.join(os.path.dirname(__file__), 'model', 'label_encoder.json')


class ModelInferenceEngine:
    """
    Manages loading the neural network weights and computing class logits.
    """
    def __init__(self, weights_path: str = WEIGHTS_PATH):
        self.weights_path = weights_path
        self.labels = self._load_labels()
        self.is_weights_loaded = False
        self.model = None

        self._initialize_model()

    def _load_labels(self) -> list:
        if os.path.exists(LABELS_PATH):
            with open(LABELS_PATH, 'r') as f:
                data = json.load(f)
                return data.get('classes', [])
        return []

    def _initialize_model(self):
        """Attempts to load PyTorch weights if available on disk."""
        if os.path.exists(self.weights_path):
            try:
                import torch
                from ml.model.model_architecture import CropDiseaseClassifier

                self.model = CropDiseaseClassifier(num_classes=len(self.labels), pretrained=False)
                state_dict = torch.load(self.weights_path, map_location='cpu')
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self.is_weights_loaded = True
                print(f"[AgriShield ML] Successfully loaded model weights from {self.weights_path}")
            except Exception as e:
                print(f"[AgriShield ML Warning] Could not load weights file: {e}")
                self.is_weights_loaded = False
        else:
            # Model weights not yet present in repository
            self.is_weights_loaded = False

    def predict_tensor(self, tensor_batch) -> Optional[Dict[str, Any]]:
        """
        Executes model forward pass on preprocessed numpy / torch batch.
        """
        if not self.is_weights_loaded or self.model is None:
            return None

        try:
            import torch
            with torch.no_grad():
                inputs = torch.tensor(tensor_batch, dtype=torch.float32)
                outputs = self.model(inputs)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                top_prob, top_idx = torch.topk(probabilities, 1)

                idx = top_idx.item()
                confidence = float(top_prob.item())
                matched_class = self.labels[idx]

                return {
                    "crop": matched_class["crop"],
                    "disease": matched_class["disease"],
                    "pathogen": matched_class.get("pathogen", "N/A"),
                    "confidence": round(confidence, 4),
                    "model_source": "PyTorch CNN Local Weights",
                    "class_index": idx
                }
        except Exception as e:
            print(f"[AgriShield ML Inference Error] {e}")
            return None
