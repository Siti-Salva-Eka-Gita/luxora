from django.db import models
from core.models import BaseModel


class Kategori(BaseModel):
    nama = models.CharField(max_length=100)
    deskripsi = models.TextField(blank=True, default="")

    class Meta(BaseModel.Meta):
        verbose_name = "Kategori"
        verbose_name_plural = "Kategori"
        db_table = "master_kategori"

    def __str__(self):
        return self.nama

    def to_summary_dict(self):
        return {
            "id": self.pk,
            "nama": self.nama,
            "deskripsi": self.deskripsi,
        }


class Produk(BaseModel):
    kode_produk = models.CharField(max_length=20, unique=True)
    nama = models.CharField(max_length=200)
    kategori = models.ForeignKey(
        Kategori, on_delete=models.CASCADE, related_name="produk_set"
    )
    supplier = models.ForeignKey(
        "Supplier",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="produk_set",
    )

    _harga = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        db_column="harga",
        help_text="Private field. Akses via property `harga`.",
    )

    stok = models.IntegerField(default=0)
    stok_minimum = models.IntegerField(default=5)

    class Meta(BaseModel.Meta):
        verbose_name = "Produk"
        verbose_name_plural = "Produk"
        db_table = "master_produk"

    def __str__(self):
        return f"{self.kode_produk} — {self.nama}"

    @property
    def harga(self):
        return int(self._harga)

    def set_harga(self, value):
        if value < 0:
            raise ValueError("Harga tidak boleh negatif!")
        self._harga = value

    @property
    def status_stok(self):
        if self.stok <= 0:
            return "HABIS"
        elif self.stok <= self.stok_minimum:
            return "RENDAH"
        return "TERSEDIA"

    @property
    def kategori_nama(self):
        return self.kategori.nama if self.kategori_id else ""

    @property
    def supplier_nama(self):
        return self.supplier.nama if self.supplier_id else ""

    def to_summary_dict(self):
        return {
            "id": self.pk,
            "kode_produk": self.kode_produk,
            "nama": self.nama,
            "harga": self.harga,
            "stok": self.stok,
            "status_stok": self.status_stok,
        }


class Supplier(BaseModel):
    nama = models.CharField(max_length=200)
    no_hp = models.CharField(max_length=20, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    alamat = models.TextField(blank=True, default="")

    class Meta(BaseModel.Meta):
        verbose_name = "Supplier"
        verbose_name_plural = "Supplier"
        db_table = "master_supplier"

    def __str__(self):
        return self.nama

    def to_summary_dict(self):
        return {
            "id": self.pk,
            "nama": self.nama,
            "email": self.email,
        }


class SupplierKategori(BaseModel):
    supplier = models.ForeignKey(
        Supplier, on_delete=models.CASCADE, related_name="kategori_set"
    )
    kategori = models.ForeignKey(
        Kategori, on_delete=models.CASCADE, related_name="supplier_set"
    )

    class Meta(BaseModel.Meta):
        verbose_name = "Supplier Kategori"
        verbose_name_plural = "Supplier Kategori"
        db_table = "master_supplier_kategori"
        unique_together = ["supplier", "kategori"]

    def __str__(self):
        return f"{self.supplier.nama} → {self.kategori.nama}"
