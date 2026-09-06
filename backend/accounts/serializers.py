from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FarmerProfile, Village

class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = '__all__'

class FarmerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = FarmerProfile
        fields = [
            'id', 'username', 'email', 'first_name', 'phone',
            'village', 'village_name', 'district', 'state',
            'crops_grown', 'preferred_language', 'farm_size_acres',
            'role', 'created_at'
        ]

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    village = serializers.CharField(max_length=150)
    district = serializers.CharField(max_length=150)
    state = serializers.CharField(max_length=150)
    crops_grown = serializers.CharField(max_length=500)
    preferred_language = serializers.CharField(default='en')
    role = serializers.CharField(default='farmer')
