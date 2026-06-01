from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/master/", include("master.urls")),
    path("api/", include("penjualan.urls")),
    path("api/laporan/penjualan/", include("laporan.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]
