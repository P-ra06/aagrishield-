from django.db import models
from django.contrib.auth.models import User

class Village(models.Model):
    name = models.CharField(max_length=150)
    district = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    pincode = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.district}, {self.state}"

class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    village = models.ForeignKey(Village, on_delete=models.SET_NULL, null=True, blank=True, related_name='farmers')
    village_name = models.CharField(max_length=150, blank=True)
    district = models.CharField(max_length=150, blank=True)
    state = models.CharField(max_length=150, blank=True)
    crops_grown = models.TextField(help_text="Comma-separated list of crops grown, e.g., Potato, Tomato, Rice")
    preferred_language = models.CharField(max_length=10, default='en', choices=[('en', 'English'), ('hi', 'Hindi'), ('or', 'Odia')])
    farm_size_acres = models.DecimalField(max_digits=6, decimal_places=2, default=2.5)
    role = models.CharField(max_length=20, default='farmer', choices=[('farmer', 'Farmer'), ('admin', 'Admin')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.village_name or 'No Village'})"
