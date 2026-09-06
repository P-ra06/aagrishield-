from django.db import models

class OutbreakSetting(models.Model):
    threshold_cases = models.IntegerField(default=3, help_text="Number of reports within timeframe to trigger outbreak alert")
    timeframe_days = models.IntegerField(default=7, help_text="Lookback window in days")
    radius_km = models.FloatField(default=25.0, help_text="Radius to group nearby villages")

    def __str__(self):
        return f"Threshold: {self.threshold_cases} cases in {self.timeframe_days} days"

class OutbreakAlert(models.Model):
    disease_name = models.CharField(max_length=150)
    crop_name = models.CharField(max_length=100)
    focal_village = models.CharField(max_length=150)
    district = models.CharField(max_length=150)
    state = models.CharField(max_length=150, default='Odisha')
    affected_villages = models.TextField(help_text="Comma-separated or JSON list of villages")
    case_count = models.IntegerField(default=1)
    risk_level = models.CharField(max_length=50, default='HIGH', choices=[('MODERATE', 'Moderate'), ('HIGH', 'High'), ('CRITICAL', 'Critical')])
    status = models.CharField(max_length=50, default='ACTIVE', choices=[('ACTIVE', 'Active Outbreak'), ('MONITORED', 'Under Surveillance'), ('CONTAINED', 'Contained')])
    recommended_action = models.TextField()
    detected_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"OUTBREAK: {self.disease_name} in {self.district} ({self.case_count} cases)"
