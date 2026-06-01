from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KategoriViewSet, ProdukViewSet, SupplierViewSet, SupplierKategoriViewSet

router = DefaultRouter()
router.register(r'kategori', KategoriViewSet, basename='kategori')
router.register(r'produk', ProdukViewSet, basename='produk')
router.register(r'supplier', SupplierViewSet, basename='supplier')
router.register(r'supplier-kategori', SupplierKategoriViewSet, basename='supplier-kategori')

urlpatterns = [
    path('', include(router.urls)),
]
