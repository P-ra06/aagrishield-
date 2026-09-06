from django.db import models

class WeatherRecord(models.Model):
    village_name = models.CharField(max_length=150)
    district = models.CharField(max_length=150)
    temperature_c = models.FloatField()
    humidity_pct = models.FloatField()
    rainfall_mm = models.FloatField(default=0.0)
    wind_speed_kmh = models.FloatField(default=0.0)
    weather_condition = models.CharField(max_length=100)
    risk_level = models.CharField(max_length=50) # LOW, MODERATE, HIGH, CRITICAL
    risk_category = models.CharField(max_length=100) # Fungal Infection, Bacterial Blight, Pest Spread
    risk_reason = models.TextField()
    possible_diseases = models.TextField()
    preventive_actions = models.TextField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.village_name} Weather Risk: {self.risk_level} ({self.recorded_at.strftime('%Y-%m-%d')})"
