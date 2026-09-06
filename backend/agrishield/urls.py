"""
AgriShield URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/profile/', include('accounts.profile_urls')),
    path('api/detection/', include('detection.urls')),
    path('api/diseases/', include('diseases.urls')),
    path('api/weather/', include('weather.urls')),
    path('api/risk/', include('weather.risk_urls')),
    path('api/outbreaks/', include('outbreaks.urls')),
    path('api/alerts/', include('alerts.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
