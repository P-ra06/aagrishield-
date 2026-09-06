from django.db import models
from django.contrib.auth.models import User
from accounts.models import Village

class DetectionRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='detections')
    village = models.ForeignKey(Village, on_delete=models.SET_NULL, null=True, blank=True)
    village_name = models.CharField(max_length=150)
    district = models.CharField(max_length=150, blank=True)
    state = models.CharField(max_length=150, blank=True)
    crop_name = models.CharField(max_length=100)
    disease_name = models.CharField(max_length=150)
    confidence = models.FloatField()
    severity = models.CharField(max_length=50) # Low, Moderate, High, Severe
    image_url = models.TextField() # Data URI or file storage URL
    symptoms_observed = models.TextField()
    prevention_recommended = models.TextField()
    treatment_recommended = models.TextField()
    warning_signs = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.crop_name} - {self.disease_name} ({self.created_at.strftime('%Y-%m-%d')})"
