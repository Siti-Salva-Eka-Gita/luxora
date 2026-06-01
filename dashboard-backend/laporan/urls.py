from django.urls import path
from .views import LaporanPenjualanView

urlpatterns = [
    path('', LaporanPenjualanView.as_view(), name='laporan-penjualan'),
]
