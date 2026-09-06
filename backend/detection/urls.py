from django.urls import path
from .views import DetectionView, DetectionHistoryView

urlpatterns = [
    path('', DetectionView.as_view(), name='detection-submit'),
    path('history/', DetectionHistoryView.as_view(), name='detection-history'),
]
