from rest_framework import serializers
from .models import OutbreakAlert, OutbreakSetting

class OutbreakAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutbreakAlert
        fields = '__all__'

class OutbreakSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutbreakSetting
        fields = '__all__'
