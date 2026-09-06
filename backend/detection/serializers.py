from rest_framework import serializers
from .models import DetectionRecord

class DetectionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectionRecord
        fields = '__all__'
