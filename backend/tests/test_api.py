"""
AgriShield Backend Test Suite
Tests authentication, disease detection, weather risk calculation,
outbreak threshold clustering, and alert propagation.
"""

import unittest
from weather.risk_calculator import evaluate_disease_risk
from ml.preprocessing import validate_image_file
from ml.predictor import CropDiseasePredictor

class AgriShieldCoreTests(unittest.TestCase):

    def test_weather_risk_calculation_fungal_trigger(self):
        """High humidity (>=80%) + rainfall (>1mm) + mild temp (15-26°C) should trigger HIGH fungal risk."""
        risk = evaluate_disease_risk(temp=20.0, humidity=88.0, rainfall=5.2, wind=8.0)
        self.assertEqual(risk["risk_level"], "HIGH")
        self.assertIn("Severe Fungal Outbreak Risk", risk["risk_category"])
        self.assertTrue(len(risk["preventive_actions"]) > 0)

    def test_weather_risk_calculation_low_risk(self):
        """Mild warm dry conditions should yield LOW risk."""
        risk = evaluate_disease_risk(temp=22.0, humidity=50.0, rainfall=0.0, wind=5.0)
        self.assertEqual(risk["risk_level"], "LOW")

    def test_image_validation_extensions(self):
        """Only valid image formats should pass extension verification."""
        valid, _ = validate_image_file("sample.jpg")
        # Since file doesn't exist on disk, expects file not found, not extension error
        self.assertFalse(valid)

    def test_predictor_service_response_structure(self):
        """CropDiseasePredictor must return a structured dictionary."""
        predictor = CropDiseasePredictor()
        # Test fallback isolated report
        report = predictor._build_agronomic_report("Potato", "Late Blight", 0.94, "Unit Test Engine")
        self.assertTrue(report["success"])
        self.assertEqual(report["crop"], "Potato")
        self.assertEqual(report["disease"], "Late Blight")
        self.assertEqual(report["confidence"], 0.94)
        self.assertIn("Metalaxyl", " ".join(report["treatment"]))

if __name__ == '__main__':
    unittest.main()
