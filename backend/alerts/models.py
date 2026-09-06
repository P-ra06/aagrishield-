from django.db import models
from django.contrib.auth.models import User

class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    title = models.CharField(max_length=255)
    alert_type = models.CharField(max_length=50, choices=[
        ('OUTBREAK', 'Community Outbreak'),
        ('WEATHER_RISK', 'Weather-Induced Risk'),
        ('DETECTION', 'Infection Detected'),
        ('ADVISORY', 'Agricultural Advisory')
    ])
    severity = models.CharField(max_length=50, choices=[
        ('INFO', 'Information'),
        ('WARNING', 'Warning'),
        ('HIGH', 'High Risk'),
        ('CRITICAL', 'Emergency / Critical')
    ], default='WARNING')
    message = models.TextField()
    village = models.CharField(max_length=150, blank=True)
    is_read = models.BooleanField(default=False)
    channel_delivery_status = models.CharField(max_length=50, default='in_app', help_text="in_app, sms_queued, push_sent")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.severity}] {self.title}"
