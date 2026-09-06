from django.urls import path
from .views import AlertListView, AlertMarkReadView

urlpatterns = [
    path('', AlertListView.as_view(), name='alerts-list'),
    path('<int:pk>/read/', AlertMarkReadView.as_view(), name='alerts-mark-read'),
]
