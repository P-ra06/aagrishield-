from django.urls import path
from .views import DiseaseRiskView

urlpatterns = [
    path('', DiseaseRiskView.as_view(), name='weather-risk'),
]
