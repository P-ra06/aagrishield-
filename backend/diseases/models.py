from django.db import models

class Crop(models.Model):
    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

class Disease(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='diseases')
    crop_name = models.CharField(max_length=100)
    name = models.CharField(max_length=150)
    pathogen = models.CharField(max_length=150, blank=True)
    pathogen_type = models.CharField(max_length=50, blank=True) # Fungal, Bacterial, Viral, Pest
    symptoms = models.TextField()
    causes = models.TextField()
    prevention = models.TextField()
    treatment = models.TextField()
    severity = models.CharField(max_length=50, default='Moderate')
    optimal_temp_min = models.FloatField(default=15.0)
    optimal_temp_max = models.FloatField(default=28.0)
    critical_humidity_pct = models.FloatField(default=80.0)
    warning_signs = models.TextField(blank=True)

    def __str__(self):
        return f"{self.crop_name} - {self.name}"
