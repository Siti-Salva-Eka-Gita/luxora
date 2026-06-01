from django.db import models
from core.models import BaseModel
from master.models import Produk


class Transaksi(BaseModel):
    STATUS_CHOICES = [
        ("SELESAI", "Selesai"),
        ("PROSES", "Diproses"),
        ("BATAL", "Batal"),
    ]
    METODE_CHOICES = [
        ("Cash", "Cash"),
        ("QRIS", "QRIS"),
        ("Transfer", "Transfer"),
    ]

    kode_invoice = models.CharField(max_length=50, unique=True)
    tanggal = models.DateField()
    pelanggan_nama = models.CharField(max_length=200)
    metode = models.CharField(max_length=20, choices=METODE_CHOICES, default="Cash")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="SELESAI")

    # Encapsulation: Private field
    _total = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        db_column="total",
    )

    class Meta(BaseModel.Meta):
        verbose_name = "Transaksi"
        verbose_name_plural = "Transaksi"
        db_table = "penjualan_transaksi"

    def __str__(self):
        return f"{self.kode_invoice} — {self.pelanggan_nama}"

    # enkapsulasi
    @property
    def total(self):
        return int(self._total)

    @property
    def jumlah_item(self):
        return self.detail_set.aggregate(total=models.Sum("qty"))["total"] or 0

    # override
    def calculate_total(self):
        total = sum(d.qty * d.harga_satuan for d in self.detail_set.all())
        self._total = total
        self.save(update_fields=["_total"])
        return total

    def to_summary_dict(self):
        return {
            "id": self.pk,
            "kode_invoice": self.kode_invoice,
            "pelanggan_nama": self.pelanggan_nama,
            "total": self.total,
            "status": self.status,
            "tanggal": str(self.tanggal),
        }


class TransaksiDetail(BaseModel):
    transaksi = models.ForeignKey(
        Transaksi, on_delete=models.CASCADE, related_name="detail_set"
    )
    produk = models.ForeignKey(
        Produk, on_delete=models.CASCADE, related_name="transaksi_detail_set"
    )
    qty = models.IntegerField(default=1)
    harga_satuan = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta(BaseModel.Meta):
        verbose_name = "Transaksi Detail"
        verbose_name_plural = "Transaksi Detail"
        db_table = "penjualan_transaksi_detail"

    def __str__(self):
        return f"{self.transaksi.kode_invoice} — {self.produk.nama} x{self.qty}"

    @property
    def subtotal(self):
        return int(self.qty * self.harga_satuan)

    @property
    def produk_nama(self):
        return self.produk.nama if self.produk_id else ""


class Retur(BaseModel):
    STATUS_CHOICES = [
        ("PROSES", "Diproses"),
        ("SELESAI", "Selesai"),
        ("DITOLAK", "Ditolak"),
    ]

    kode_retur = models.CharField(max_length=50, unique=True)
    transaksi = models.ForeignKey(
        Transaksi, on_delete=models.CASCADE, related_name="retur_set"
    )
    tanggal = models.DateField()
    alasan = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PROSES")

    # enkapsulasi
    _total_nilai = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        db_column="total_nilai",
        help_text="Private. Akses via property `total_nilai`.",
    )

    class Meta(BaseModel.Meta):
        verbose_name = "Retur"
        verbose_name_plural = "Retur"
        db_table = "penjualan_retur"

    def __str__(self):
        return f"{self.kode_retur} ← {self.transaksi.kode_invoice}"

    @property
    def total_nilai(self):
        return int(self._total_nilai)

    @property
    def kode_invoice(self):
        return self.transaksi.kode_invoice if self.transaksi_id else ""

    @property
    def pelanggan_nama(self):
        return self.transaksi.pelanggan_nama if self.transaksi_id else ""

    @property
    def jumlah_item(self):
        return self.detail_set.aggregate(total=models.Sum("qty"))["total"] or 0

    @property
    def produk_nama_pertama(self):
        first = self.detail_set.first()
        return first.produk_nama if first else "-"

    def calculate_total(self):
        total = sum(d.nilai for d in self.detail_set.all())
        self._total_nilai = total
        self.save(update_fields=["_total_nilai"])
        return total

    # ── Polymorphism: Override to_summary_dict() ───────
    def to_summary_dict(self):
        return {
            "id": self.pk,
            "kode_retur": self.kode_retur,
            "kode_invoice": self.kode_invoice,
            "total_nilai": self.total_nilai,
            "status": self.status,
            "tanggal": str(self.tanggal),
        }


class ReturDetail(BaseModel):
    retur = models.ForeignKey(
        Retur, on_delete=models.CASCADE, related_name="detail_set"
    )
    produk = models.ForeignKey(
        Produk, on_delete=models.CASCADE, related_name="retur_detail_set"
    )
    qty = models.IntegerField(default=1)
    nilai = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta(BaseModel.Meta):
        verbose_name = "Retur Detail"
        verbose_name_plural = "Retur Detail"
        db_table = "penjualan_retur_detail"

    def __str__(self):
        return f"{self.retur.kode_retur} — {self.produk.nama} x{self.qty}"

    @property
    def produk_nama(self):
        return self.produk.nama if self.produk_id else ""
