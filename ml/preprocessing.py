"""
AgriShield - Machine Learning Pipeline
Module: preprocessing.py
Handles image validation, dimension verification, OpenCV/PIL transforms,
and tensor normalization for crop leaf classification.
"""

import io
import os
from typing import Tuple, Union, Optional, Any

try:
    from PIL import Image
except ImportError:
    Image = None

try:
    import numpy as np
except ImportError:
    np = None

# Standard ImageNet / PlantVillage normalization constants
IMAGE_SIZE = (224, 224)
NORM_MEAN = [0.485, 0.456, 0.406]
NORM_STD = [0.229, 0.224, 0.225]
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_FILE_SIZE_MB = 10.0


def validate_image_file(file_data: Union[bytes, str], max_mb: float = MAX_FILE_SIZE_MB) -> Tuple[bool, Optional[str]]:
    """
    Validates image data size and basic integrity.
    Returns (is_valid, error_message).
    """
    if isinstance(file_data, str):
        if not os.path.exists(file_data):
            return False, f"File not found at path: {file_data}"
        size_mb = os.path.getsize(file_data) / (1024 * 1024)
        ext = os.path.splitext(file_data)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return False, f"Unsupported file extension: {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        if size_mb > max_mb:
            return False, f"File size ({size_mb:.2f} MB) exceeds maximum allowed ({max_mb} MB)"
    elif isinstance(file_data, bytes):
        size_mb = len(file_data) / (1024 * 1024)
        if size_mb > max_mb:
            return False, f"File size ({size_mb:.2f} MB) exceeds maximum allowed ({max_mb} MB)"
    else:
        return False, "Invalid file data type. Expected bytes or file path."

    return True, None


def preprocess_image_for_model(
    image_input: Union[bytes, str, Any],
    target_size: Tuple[int, int] = IMAGE_SIZE
):
    """
    Preprocesses leaf image:
    1. Loads into PIL Image in RGB format
    2. Resizes with anti-aliasing to target_size (default 224x224)
    3. Converts to float32 array normalized to [0, 1]
    4. Applies standard ImageNet mean and std channel standardization
    5. Transposes to channel-first (C, H, W) and adds batch dimension (1, C, H, W)
    """
    if isinstance(image_input, (bytes, bytearray)):
        image = Image.open(io.BytesIO(image_input)).convert('RGB')
    elif isinstance(image_input, str):
        image = Image.open(image_input).convert('RGB')
    elif isinstance(image_input, Image.Image):
        image = image_input.convert('RGB')
    else:
        raise ValueError("Unsupported image input format.")

    # High-quality bicubic resize
    resized = image.resize(target_size, Image.Resampling.BICUBIC)
    arr = np.array(resized, dtype=np.float32) / 255.0

    # Channel normalization
    arr = (arr - np.array(NORM_MEAN, dtype=np.float32)) / np.array(NORM_STD, dtype=np.float32)

    # Convert to CHW format: (224, 224, 3) -> (3, 224, 224)
    arr = np.transpose(arr, (2, 0, 1))

    # Add batch dimension: (1, 3, 224, 224)
    batch_tensor = np.expand_dims(arr, axis=0)
    return batch_tensor
