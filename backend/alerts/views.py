from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Alert
from .serializers import AlertSerializer

class AlertListView(APIView):
    def get(self, request):
        severity = request.query_params.get('severity')
        unread_only = request.query_params.get('unread') == 'true'

        alerts = Alert.objects.all().order_by('-created_at')
        if severity:
            alerts = alerts.filter(severity__iexact=severity)
        if unread_only:
            alerts = alerts.filter(is_read=False)

        serializer = AlertSerializer(alerts, many=True)
        unread_count = Alert.objects.filter(is_read=False).count()

        return Response({
            "alerts": serializer.data,
            "unread_count": unread_count
        })

    def post(self, request):
        serializer = AlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlertMarkReadView(APIView):
    def post(self, request, pk):
        try:
            alert = Alert.objects.get(pk=pk)
            alert.is_read = True
            alert.save()
            return Response({"status": "marked_as_read", "id": pk})
        except Alert.DoesNotExist:
            return Response({"error": "Alert not found"}, status=status.HTTP_404_NOT_FOUND)
