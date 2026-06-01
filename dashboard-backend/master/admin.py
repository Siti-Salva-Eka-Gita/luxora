from django.contrib import admin
from .models import Kategori, Produk, Supplier, SupplierKategori


@admin.register(Kategori)
class KategoriAdmin(admin.ModelAdmin):
    list_display = ["id", "nama", "deskripsi", "created_at"]
    search_fields = ["nama"]


@admin.register(Produk)
class ProdukAdmin(admin.ModelAdmin):
    list_display = ["kode_produk", "nama", "kategori", "_harga", "stok", "stok_minimum"]
    list_filter = ["kategori"]
    search_fields = ["kode_produk", "nama"]


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ["id", "nama", "no_hp", "email"]
    search_fields = ["nama"]


@admin.register(SupplierKategori)
class SupplierKategoriAdmin(admin.ModelAdmin):
    list_display = ["id", "supplier", "kategori"]
