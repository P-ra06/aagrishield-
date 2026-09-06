from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OutbreakAlert, OutbreakSetting
from .serializers import OutbreakAlertSerializer, OutbreakSettingSerializer

class OutbreakListView(APIView):
    def get(self, request):
        status_filter = request.query_params.get('status', 'ACTIVE')
        outbreaks = OutbreakAlert.objects.filter(status=status_filter) if status_filter else OutbreakAlert.objects.all()
        serializer = OutbreakAlertSerializer(outbreaks, many=True)
        return Response(serializer.data)

class OutbreakSettingView(APIView):
    def get(self, request):
        setting, _ = OutbreakSetting.objects.get_or_create(id=1)
        return Response(OutbreakSettingSerializer(setting).data)

    def post(self, request):
        setting, _ = OutbreakSetting.objects.get_or_create(id=1)
        if 'threshold_cases' in request.data:
            setting.threshold_cases = int(request.data['threshold_cases'])
        if 'timeframe_days' in request.data:
            setting.timeframe_days = int(request.data['timeframe_days'])
        if 'radius_km' in request.data:
            setting.radius_km = float(request.data['radius_km'])
        setting.save()
        return Response({
            "message": "Outbreak detection threshold updated successfully.",
            "setting": OutbreakSettingSerializer(setting).data
        })
