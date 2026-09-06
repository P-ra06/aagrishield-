"""
AgriShield - Machine Learning Pipeline
Module: model/model_architecture.py
Defines the PyTorch CNN architecture (ResNet/MobileNet backbone)
for multi-class agricultural leaf disease identification.
"""

try:
    import torch
    import torch.nn as nn
    from torchvision import models

    class CropDiseaseClassifier(nn.Module):
        """
        Deep Residual CNN Model for 38 Crop-Disease combinations.
        Utilizes transfer learning on MobileNetV3-Large or ResNet-50.
        """
        def __init__(self, num_classes: int = 38, pretrained: bool = True):
            super().__init__()
            # Lightweight MobileNetV3 backbone for rapid edge/server inference
            self.backbone = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT if pretrained else None)
            in_features = self.backbone.classifier[0].in_features
            
            # Custom agronomist classifier head
            self.backbone.classifier = nn.Sequential(
                nn.Linear(in_features, 512),
                nn.Hardswish(),
                nn.Dropout(p=0.3),
                nn.Linear(512, 128),
                nn.Hardswish(),
                nn.Dropout(p=0.2),
                nn.Linear(128, num_classes)
            )

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            return self.backbone(x)

except ImportError:
    # Fallback stub when PyTorch is not yet installed in dev environment
    class CropDiseaseClassifier:
        def __init__(self, num_classes: int = 38, pretrained: bool = False):
            self.num_classes = num_classes
