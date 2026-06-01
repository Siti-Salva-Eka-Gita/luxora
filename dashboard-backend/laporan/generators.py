from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from core.reports import AbstractReportGenerator
from penjualan.models import Transaksi


class SalesReportGenerator(AbstractReportGenerator):
    def generate(self):
        return {
            "riwayat_bulanan": self.get_detail(),
            "summary": self.get_summary(),
            "periode": self.get_date_range_display(),
        }

    def get_summary(self):
        qs = Transaksi.objects.filter(_is_active=True, status="SELESAI")

        if self._start_date:
            qs = qs.filter(tanggal__gte=self._start_date)
        if self._end_date:
            qs = qs.filter(tanggal__lte=self._end_date)

        agg = qs.aggregate(
            total_penjualan=Sum("_total"),
            total_transaksi=Count("id"),
        )

        return {
            "total_penjualan": int(agg["total_penjualan"] or 0),
            "total_transaksi": agg["total_transaksi"],
        }

    def get_detail(self):
        qs = Transaksi.objects.filter(_is_active=True, status="SELESAI")

        if self._start_date:
            qs = qs.filter(tanggal__gte=self._start_date)
        if self._end_date:
            qs = qs.filter(tanggal__lte=self._end_date)

        monthly = (
            qs.annotate(bulan=TruncMonth("tanggal"))
            .values("bulan")
            .annotate(
                jumlah_transaksi=Count("id"),
                total_penjualan=Sum("_total"),
            )
            .order_by("bulan")
        )

        result = []
        prev_total = None

        for row in monthly:
            total = int(row["total_penjualan"] or 0)

            if prev_total is not None and prev_total > 0:
                growth = round(((total - prev_total) / prev_total) * 100, 1)
            else:
                growth = None

            result.append(
                {
                    "periode": row["bulan"].strftime("%B %Y"),
                    "jumlah_transaksi": row["jumlah_transaksi"],
                    "total_penjualan": total,
                    "pertumbuhan": growth,
                }
            )

            prev_total = total

        result.reverse()
        return result
