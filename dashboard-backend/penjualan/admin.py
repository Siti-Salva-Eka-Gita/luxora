from django.contrib import admin
from .models import Transaksi, TransaksiDetail, Retur, ReturDetail


class TransaksiDetailInline(admin.TabularInline):
    model = TransaksiDetail
    extra = 0


@admin.register(Transaksi)
class TransaksiAdmin(admin.ModelAdmin):
    list_display = [
        "kode_invoice",
        "tanggal",
        "pelanggan_nama",
        "_total",
        "metode",
        "status",
    ]
    list_filter = ["status", "metode"]
    search_fields = ["kode_invoice", "pelanggan_nama"]
    inlines = [TransaksiDetailInline]


class ReturDetailInline(admin.TabularInline):
    model = ReturDetail
    extra = 0


@admin.register(Retur)
class ReturAdmin(admin.ModelAdmin):
    list_display = ["kode_retur", "transaksi", "tanggal", "status", "_total_nilai"]
    list_filter = ["status"]
    search_fields = ["kode_retur"]
    inlines = [ReturDetailInline]
