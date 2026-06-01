from django.db.models.functions import TruncMonth
from datetime import date, timedelta
from django.db.models import Sum, Count, Q, F
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response

from master.models import Produk
from penjualan.models import Transaksi


class DashboardView(APIView):
    def get(self, request):
        data = {
            "summary": self._get_summary(),
            "grafik_penjualan": self._get_sales_chart(),
            "distribusi_stok": self._get_stock_distribution(),
            "transaksi_terbaru": self._get_recent_transactions(),
            "produk_stok_rendah": self._get_low_stock_products(),
        }
        return Response(data)

    def _get_summary(self):
        produk_qs = Produk.objects.filter(_is_active=True)
        transaksi_qs = Transaksi.objects.filter(_is_active=True, status="SELESAI")

        total_penjualan = transaksi_qs.aggregate(total=Sum("_total"))["total"] or 0

        total_transaksi = transaksi_qs.count()
        total_produk = produk_qs.count()

        stok_rendah = produk_qs.filter(Q(stok__lte=F("stok_minimum"))).count()

        return {
            "total_penjualan": int(total_penjualan),
            "total_transaksi": total_transaksi,
            "total_produk": total_produk,
            "stok_rendah": stok_rendah,
        }

    def _get_sales_chart(self):
        end_date = date.today()
        start_date = end_date - timedelta(days=365)

        monthly = (
            Transaksi.objects.filter(
                _is_active=True,
                status="SELESAI",
                tanggal__gte=start_date,
                tanggal__lte=end_date,
            )
            .annotate(bulan=TruncMonth("tanggal"))
            .values("bulan")
            .annotate(total=Sum("_total"))
            .order_by("bulan")
        )

        return [
            {
                "periode": row["bulan"].strftime("%b %Y"),
                "total": int(row["total"] or 0),
            }
            for row in monthly
            if row["bulan"] is not None
        ]

    def _get_stock_distribution(self):
        produk_qs = Produk.objects.filter(_is_active=True)

        tersedia = produk_qs.filter(stok__gt=F("stok_minimum")).count()
        rendah = produk_qs.filter(stok__gt=0, stok__lte=F("stok_minimum")).count()
        habis = produk_qs.filter(stok__lte=0).count()

        return [
            {"label": "Stok Tersedia", "jumlah": tersedia},
            {"label": "Stok Rendah", "jumlah": rendah},
            {"label": "Stok Habis", "jumlah": habis},
        ]

    def _get_recent_transactions(self):
        recent = Transaksi.objects.filter(_is_active=True).order_by(
            "-tanggal", "-created_at"
        )[:10]

        return [
            {
                "kode_invoice": t.kode_invoice,
                "tanggal": str(t.tanggal),
                "pelanggan_nama": t.pelanggan_nama,
                "total": t.total,
                "status": t.status,
            }
            for t in recent
        ]

    def _get_low_stock_products(self):
        low = (
            Produk.objects.filter(_is_active=True)
            .filter(stok__lte=F("stok_minimum"))
            .select_related("kategori")
            .order_by("stok")[:10]
        )

        return [
            {
                "nama": p.nama,
                "kategori__nama": p.kategori_nama,
                "stok": p.stok,
                "stok_minimum": p.stok_minimum,
            }
            for p in low
        ]
