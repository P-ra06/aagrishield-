from django.urls import path
from .views import OutbreakListView, OutbreakSettingView

urlpatterns = [
    path('', OutbreakListView.as_view(), name='outbreaks-list'),
    path('settings/', OutbreakSettingView.as_view(), name='outbreaks-settings'),
]
