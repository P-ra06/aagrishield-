from rest_framework.views import APIView
from rest_framework.response import Response
from .risk_calculator import fetch_live_weather, evaluate_disease_risk, DISTRICT_COORDINATES

class WeatherView(APIView):
    def get(self, request):
        district = request.query_params.get('district', 'Balasore')
        lat, lon = DISTRICT_COORDINATES.get(district, (21.5034, 86.9248))

        weather = fetch_live_weather(lat, lon)
        return Response({
            "district": district,
            "latitude": lat,
            "longitude": lon,
            **weather
        })

class DiseaseRiskView(APIView):
    def get(self, request):
        district = request.query_params.get('district', 'Balasore')
        lat, lon = DISTRICT_COORDINATES.get(district, (21.5034, 86.9248))

        weather = fetch_live_weather(lat, lon)
        temp = float(request.query_params.get('temp', weather['temperature']))
        humidity = float(request.query_params.get('humidity', weather['humidity']))
        rainfall = float(request.query_params.get('rainfall', weather['rainfall']))
        wind = float(request.query_params.get('wind', weather['wind_speed']))

        risk_analysis = evaluate_disease_risk(temp, humidity, rainfall, wind)

        return Response({
            "district": district,
            "village": request.query_params.get('village', 'Balarampur'),
            **risk_analysis
        })
