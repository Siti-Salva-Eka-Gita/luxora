from rest_framework import serializers
from core.serializers import BaseSerializer
from .models import Transaksi, TransaksiDetail, Retur, ReturDetail


class TransaksiDetailSerializer(BaseSerializer):
    produk_nama = serializers.CharField(read_only=True)
    subtotal = serializers.IntegerField(read_only=True)

    class Meta(BaseSerializer.Meta):
        model = TransaksiDetail
        fields = [
            "id",
            "produk",
            "produk_nama",
            "qty",
            "harga_satuan",
            "subtotal",
        ]


class TransaksiSerializer(BaseSerializer):
    detail = TransaksiDetailSerializer(source="detail_set", many=True, read_only=True)
    total = serializers.IntegerField(read_only=True)
    jumlah_item = serializers.IntegerField(read_only=True)

    class Meta(BaseSerializer.Meta):
        model = Transaksi
        fields = [
            "id",
            "kode_invoice",
            "tanggal",
            "pelanggan_nama",
            "metode",
            "status",
            "total",
            "jumlah_item",
            "detail",
            "created_at",
            "updated_at",
        ]


class ReturDetailSerializer(BaseSerializer):
    produk_nama = serializers.CharField(read_only=True)

    class Meta(BaseSerializer.Meta):
        model = ReturDetail
        fields = ["id", "produk", "produk_nama", "qty", "nilai"]


class ReturSerializer(BaseSerializer):
    detail = ReturDetailSerializer(source="detail_set", many=True, read_only=True)
    kode_invoice = serializers.CharField(read_only=True)
    pelanggan_nama = serializers.CharField(read_only=True)
    total_nilai = serializers.IntegerField(read_only=True)
    jumlah_item = serializers.IntegerField(read_only=True)
    produk_nama_pertama = serializers.CharField(read_only=True)

    class Meta(BaseSerializer.Meta):
        model = Retur
        fields = [
            "id",
            "kode_retur",
            "transaksi",
            "kode_invoice",
            "tanggal",
            "pelanggan_nama",
            "alasan",
            "status",
            "total_nilai",
            "jumlah_item",
            "produk_nama_pertama",
            "detail",
            "created_at",
            "updated_at",
        ]
