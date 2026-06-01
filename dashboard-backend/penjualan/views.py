from core.views import BaseViewSet
from .models import Transaksi, Retur
from .serializers import TransaksiSerializer, ReturSerializer


class TransaksiViewSet(BaseViewSet):
    queryset = Transaksi.objects.prefetch_related("detail_set__produk").order_by(
        "-tanggal", "-id"
    )
    serializer_class = TransaksiSerializer


class ReturViewSet(BaseViewSet):
    queryset = (
        Retur.objects.select_related("transaksi")
        .prefetch_related("detail_set__produk")
        .order_by("-tanggal", "-id")
    )
    serializer_class = ReturSerializer
