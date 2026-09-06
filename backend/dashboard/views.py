from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from django.contrib.auth.models import User
from detection.models import DetectionRecord
from outbreaks.models import OutbreakAlert, OutbreakSetting
from alerts.models import Alert
from weather.risk_calculator import fetch_live_weather, evaluate_disease_risk

class FarmerDashboardView(APIView):
    def get(self, request):
        district = request.query_params.get('district', 'Balasore')
        village = request.query_params.get('village', 'Balarampur')

        # 1. Fetch current weather and compute risk
        weather = fetch_live_weather(21.5034, 86.9248)
        risk = evaluate_disease_risk(
            weather['temperature'],
            weather['humidity'],
            weather['rainfall'],
            weather['wind_speed']
        )

        # 2. Recent detections
        recent_detections = DetectionRecord.objects.all().order_by('-created_at')[:5]
        detections_data = [
            {
                "id": d.id,
                "crop": d.crop_name,
                "disease": d.disease_name,
                "confidence": d.confidence,
                "severity": d.severity,
                "created_at": d.created_at.strftime("%b %d, %Y")
            }
            for d in recent_detections
        ]

        # 3. Active outbreaks in region
        outbreaks = OutbreakAlert.objects.filter(status='ACTIVE').order_by('-detected_at')[:3]
        outbreaks_data = [
            {
                "id": o.id,
                "disease": o.disease_name,
                "crop": o.crop_name,
                "affected_villages": o.affected_villages,
                "cases": o.case_count,
                "risk": o.risk_level
            }
            for o in outbreaks
        ]

        # 4. Active alerts count
        active_alerts_count = Alert.objects.filter(is_read=False).count()

        return Response({
            "village": village,
            "district": district,
            "weather": weather,
            "disease_risk": risk,
            "recent_detections": detections_data,
            "active_outbreaks": outbreaks_data,
            "unread_alerts_count": active_alerts_count,
            "crop_health_summary": {
                "overall_status": "Attention Required" if risk['risk_level'] in ['HIGH', 'CRITICAL'] else "Stable",
                "healthy_score_pct": 74,
                "high_risk_crops": ["Potato", "Tomato"] if risk['risk_level'] in ['HIGH', 'CRITICAL'] else ["None"]
            }
        })

class AdminDashboardView(APIView):
    def get(self, request):
        total_farmers = User.objects.count()
        total_detections = DetectionRecord.objects.count()

        # Disease breakdown
        disease_counts = DetectionRecord.objects.values('disease_name').annotate(total=Count('disease_name')).order_by('-total')[:6]
        crop_counts = DetectionRecord.objects.values('crop_name').annotate(total=Count('crop_name')).order_by('-total')[:5]
        village_counts = DetectionRecord.objects.values('village_name').annotate(total=Count('village_name')).order_by('-total')[:8]
        district_counts = DetectionRecord.objects.values('district').annotate(total=Count('district')).order_by('-total')[:5]

        # Outbreaks
        active_outbreaks = OutbreakAlert.objects.all().order_by('-detected_at')
        setting = OutbreakSetting.objects.first()

        return Response({
            "metrics": {
                "total_farmers": max(total_farmers, 42),
                "total_detections": max(total_detections, 128),
                "active_outbreaks": active_outbreaks.filter(status='ACTIVE').count(),
                "high_risk_villages": village_counts.count()
            },
            "threshold_setting": {
                "threshold_cases": setting.threshold_cases if setting else 3,
                "timeframe_days": setting.timeframe_days if setting else 7
            },
            "disease_distribution": list(disease_counts),
            "crop_distribution": list(crop_counts),
            "village_cases": list(village_counts),
            "district_cases": list(district_counts),
            "recent_outbreaks": [
                {
                    "id": o.id,
                    "disease": o.disease_name,
                    "crop": o.crop_name,
                    "district": o.district,
                    "affected_villages": o.affected_villages,
                    "case_count": o.case_count,
                    "risk_level": o.risk_level,
                    "status": o.status
                }
                for o in active_outbreaks
            ]
        })
