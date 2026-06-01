"""
penjualan/urls.py — URL routing untuk penjualan app.
Endpoint: api/transaksi/, api/retur/
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransaksiViewSet, ReturViewSet

router = DefaultRouter()
router.register(r"transaksi", TransaksiViewSet, basename="transaksi")
router.register(r"retur", ReturViewSet, basename="retur")

urlpatterns = [
    path("", include(router.urls)),
]
