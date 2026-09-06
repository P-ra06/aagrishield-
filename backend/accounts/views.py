from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import FarmerProfile, Village
from .serializers import RegisterSerializer, FarmerProfileSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        if User.objects.filter(username=data['email']).exists():
            return Response({"error": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['name']
        )

        village_obj = Village.objects.filter(name__iexact=data['village']).first()

        profile = FarmerProfile.objects.create(
            user=user,
            phone=data.get('phone', ''),
            village=village_obj,
            village_name=data['village'],
            district=data['district'],
            state=data['state'],
            crops_grown=data['crops_grown'],
            preferred_language=data.get('preferred_language', 'en'),
            role=data.get('role', 'farmer')
        )

        return Response({
            "message": "Farmer registered successfully!",
            "user": FarmerProfileSerializer(profile).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        user = authenticate(username=email, password=password)
        if not user:
            # Fallback check by username or email
            user_obj = User.objects.filter(email=email).first() or User.objects.filter(username=email).first()
            if user_obj and user_obj.check_password(password):
                user = user_obj

        if not user:
            return Response({"error": "Invalid credentials. Please check your email and password."}, status=status.HTTP_401_UNAUTHORIZED)

        profile, _ = FarmerProfile.objects.get_or_create(
            user=user,
            defaults={
                "village_name": "Baramati",
                "district": "Pune",
                "state": "Maharashtra",
                "crops_grown": "Potato, Tomato",
                "preferred_language": "en",
                "role": "admin" if user.is_staff else "farmer"
            }
        )

        return Response({
            "message": "Login successful",
            "token": f"token-{user.id}-{user.username}",
            "user": FarmerProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)

class ProfileView(APIView):
    def get(self, request):
        # In DRF prototype, return the first user or mock farmer if unauthenticated
        profile = FarmerProfile.objects.first()
        if not profile:
            return Response({"error": "No profile found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(FarmerProfileSerializer(profile).data)

    def put(self, request):
        profile = FarmerProfile.objects.first()
        if not profile:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'village_name' in data or 'village' in data:
            profile.village_name = data.get('village_name', data.get('village', profile.village_name))
        if 'district' in data:
            profile.district = data['district']
        if 'state' in data:
            profile.state = data['state']
        if 'crops_grown' in data:
            profile.crops_grown = data['crops_grown']
        if 'preferred_language' in data:
            profile.preferred_language = data['preferred_language']
        if 'phone' in data:
            profile.phone = data['phone']

        profile.save()
        return Response({
            "message": "Profile updated successfully",
            "user": FarmerProfileSerializer(profile).data
        })
