from core.views import BaseViewSet
from .models import Kategori, Produk, Supplier, SupplierKategori
from .serializers import (
    KategoriSerializer,
    ProdukSerializer,
    SupplierSerializer,
    SupplierKategoriSerializer,
)


class KategoriViewSet(BaseViewSet):
    queryset = Kategori.objects.all().order_by("id")
    serializer_class = KategoriSerializer


class ProdukViewSet(BaseViewSet):
    queryset = Produk.objects.select_related("kategori").all().order_by("id")
    serializer_class = ProdukSerializer

    def perform_destroy(self, instance):
        instance.delete()


class SupplierViewSet(BaseViewSet):
    queryset = Supplier.objects.all().order_by("id")
    serializer_class = SupplierSerializer


class SupplierKategoriViewSet(BaseViewSet):
    queryset = SupplierKategori.objects.all().order_by("id")
    serializer_class = SupplierKategoriSerializer
