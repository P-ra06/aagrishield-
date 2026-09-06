from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Disease
from .serializers import DiseaseSerializer

class DiseaseListView(APIView):
    def get(self, request):
        crop = request.query_params.get('crop', None)
        search = request.query_params.get('search', None)
        severity = request.query_params.get('severity', None)

        queryset = Disease.objects.all()
        if crop:
            queryset = queryset.filter(crop_name__icontains=crop)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(crop_name__icontains=search) |
                Q(symptoms__icontains=search)
            )
        if severity:
            queryset = queryset.filter(severity__iexact=severity)

        serializer = DiseaseSerializer(queryset, many=True)
        return Response(serializer.data)

class DiseaseDetailView(APIView):
    def get(self, request, pk):
        try:
            disease = Disease.objects.get(pk=pk)
            return Response(DiseaseSerializer(disease).data)
        except Disease.DoesNotExist:
            return Response({"error": "Disease not found"}, status=status.HTTP_404_NOT_FOUND)
