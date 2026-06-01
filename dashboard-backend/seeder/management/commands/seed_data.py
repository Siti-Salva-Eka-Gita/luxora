"""
seed_data.py — Management command untuk generate dummy data fashion Luxora.

Usage: python manage.py seed_data
"""

import random
from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from master.models import Kategori, Produk, Supplier, SupplierKategori
from penjualan.models import Transaksi, TransaksiDetail, Retur, ReturDetail


class Command(BaseCommand):
    help = "Seed database dengan dummy data fashion Luxora"

    def handle(self, *args, **options):
        self.stdout.write("[*] Memulai seeding data...\n")

        self._seed_kategori()
        self._seed_supplier()
        self._seed_supplier_kategori()
        self._seed_produk()
        self._seed_transaksi()
        self._seed_retur()

        self.stdout.write(self.style.SUCCESS("\n[OK] Seeding selesai!"))

    def _seed_kategori(self):
        """Seed 4 kategori fashion."""
        self.stdout.write("  -> Kategori...")

        data = [
            {
                "nama": "Aksesoris",
                "deskripsi": "Perhiasan, jam tangan, kacamata, dan aksesoris fashion lainnya",
            },
            {
                "nama": "Pakaian",
                "deskripsi": "Baju, celana, jaket, dress, dan koleksi pakaian premium",
            },
            {
                "nama": "Sepatu",
                "deskripsi": "Sneakers, heels, boots, sandal, dan alas kaki branded",
            },
            {
                "nama": "Tas",
                "deskripsi": "Handbag, backpack, clutch, tote bag, dan koleksi tas eksklusif",
            },
        ]

        for item in data:
            Kategori.objects.get_or_create(nama=item["nama"], defaults=item)

        self.stdout.write(self.style.SUCCESS(f" {Kategori.objects.count()} kategori"))

    def _seed_produk(self):
        """Seed 40 produk fashion."""
        self.stdout.write("  -> Produk...")

        kategori = {k.nama: k for k in Kategori.objects.all()}
        suppliers = {s.nama: s for s in Supplier.objects.all()}

        def get_supplier_for_product(nama):
            nama_lower = nama.lower()
            if "nike" in nama_lower:
                return suppliers.get("Nike Indonesia")
            if "adidas" in nama_lower:
                return suppliers.get("Adidas Indonesia")
            if "puma" in nama_lower:
                return suppliers.get("Puma Indonesia")
            if "nb " in nama_lower or "new balance" in nama_lower:
                return suppliers.get("New Balance Indonesia")
            if "onitsuka" in nama_lower:
                return suppliers.get("Onitsuka Tiger Indonesia")
            if "eiger" in nama_lower:
                return suppliers.get("Eiger Indonesia")
            if "zara" in nama_lower:
                return suppliers.get("Zara Indonesia")
            if "uniqlo" in nama_lower:
                return suppliers.get("Uniqlo Indonesia")
            if "h&m" in nama_lower:
                return suppliers.get("H&M Indonesia")
            if "stone island" in nama_lower:
                return suppliers.get("Stone Island Indonesia")
            return None

        products = [
            # Sepatu (10)
            {
                "kode": "SHO-001",
                "nama": "Nike Air Casual",
                "kat": "Sepatu",
                "harga": 1200000,
                "stok": 18,
                "min": 6,
            },
            {
                "kode": "SHO-002",
                "nama": "Adidas Run Pro",
                "kat": "Sepatu",
                "harga": 1350000,
                "stok": 14,
                "min": 5,
            },
            {
                "kode": "SHO-003",
                "nama": "Puma Street Lifestyle",
                "kat": "Sepatu",
                "harga": 980000,
                "stok": 20,
                "min": 8,
            },
            {
                "kode": "SHO-004",
                "nama": "NB Sneakers X",
                "kat": "Sepatu",
                "harga": 1650000,
                "stok": 10,
                "min": 5,
            },
            {
                "kode": "SHO-005",
                "nama": "Nike Zoom Runner",
                "kat": "Sepatu",
                "harga": 1500000,
                "stok": 0,
                "min": 4,
            },
            {
                "kode": "SHO-006",
                "nama": "Puma Flex Sneakers",
                "kat": "Sepatu",
                "harga": 850000,
                "stok": 12,
                "min": 5,
            },
            {
                "kode": "SHO-007",
                "nama": "Onitsuka Tiger Run",
                "kat": "Sepatu",
                "harga": 2500000,
                "stok": 5,
                "min": 3,
            },
            {
                "kode": "SHO-008",
                "nama": "Eiger Trail Shoes",
                "kat": "Sepatu",
                "harga": 750000,
                "stok": 22,
                "min": 8,
            },
            {
                "kode": "SHO-009",
                "nama": "New Balance Urban",
                "kat": "Sepatu",
                "harga": 1800000,
                "stok": 3,
                "min": 5,
            },
            {
                "kode": "SHO-010",
                "nama": "Nike Air Max Casual",
                "kat": "Sepatu",
                "harga": 2200000,
                "stok": 7,
                "min": 4,
            },
            # Tas (10)
            {
                "kode": "BAG-001",
                "nama": "Eiger Backpack Pro",
                "kat": "Tas",
                "harga": 650000,
                "stok": 15,
                "min": 5,
            },
            {
                "kode": "BAG-002",
                "nama": "Nike Sling Bag",
                "kat": "Tas",
                "harga": 450000,
                "stok": 25,
                "min": 8,
            },
            {
                "kode": "BAG-003",
                "nama": "Adidas Totebag",
                "kat": "Tas",
                "harga": 380000,
                "stok": 18,
                "min": 6,
            },
            {
                "kode": "BAG-004",
                "nama": "Puma Duffel Bag",
                "kat": "Tas",
                "harga": 520000,
                "stok": 10,
                "min": 4,
            },
            {
                "kode": "BAG-005",
                "nama": "Eiger Hiking Backpack",
                "kat": "Tas",
                "harga": 850000,
                "stok": 8,
                "min": 3,
            },
            {
                "kode": "BAG-006",
                "nama": "Zara Sling Bag Mini",
                "kat": "Tas",
                "harga": 550000,
                "stok": 2,
                "min": 5,
            },
            {
                "kode": "BAG-007",
                "nama": "Uniqlo Totebag Simple",
                "kat": "Tas",
                "harga": 250000,
                "stok": 30,
                "min": 10,
            },
            {
                "kode": "BAG-008",
                "nama": "H&M Duffel Sport",
                "kat": "Tas",
                "harga": 420000,
                "stok": 0,
                "min": 4,
            },
            {
                "kode": "BAG-009",
                "nama": "Nike Backpack Elite",
                "kat": "Tas",
                "harga": 750000,
                "stok": 11,
                "min": 5,
            },
            {
                "kode": "BAG-010",
                "nama": "Adidas Sling Urban",
                "kat": "Tas",
                "harga": 350000,
                "stok": 16,
                "min": 6,
            },
            # Pakaian (10)
            {
                "kode": "CLT-001",
                "nama": "Uniqlo Polo Basic",
                "kat": "Pakaian",
                "harga": 299000,
                "stok": 35,
                "min": 10,
            },
            {
                "kode": "CLT-002",
                "nama": "H&M Jersey Sport",
                "kat": "Pakaian",
                "harga": 350000,
                "stok": 20,
                "min": 8,
            },
            {
                "kode": "CLT-003",
                "nama": "Zara Slim Pants",
                "kat": "Pakaian",
                "harga": 599000,
                "stok": 12,
                "min": 5,
            },
            {
                "kode": "CLT-004",
                "nama": "Nike Training Jersey",
                "kat": "Pakaian",
                "harga": 450000,
                "stok": 18,
                "min": 6,
            },
            {
                "kode": "CLT-005",
                "nama": "Adidas Jacket Pro",
                "kat": "Pakaian",
                "harga": 850000,
                "stok": 7,
                "min": 3,
            },
            {
                "kode": "CLT-006",
                "nama": "Puma Sweater Fit",
                "kat": "Pakaian",
                "harga": 680000,
                "stok": 9,
                "min": 4,
            },
            {
                "kode": "CLT-007",
                "nama": "Uniqlo Shirt Classic",
                "kat": "Pakaian",
                "harga": 259000,
                "stok": 40,
                "min": 12,
            },
            {
                "kode": "CLT-008",
                "nama": "H&M Jacket Casual",
                "kat": "Pakaian",
                "harga": 750000,
                "stok": 4,
                "min": 5,
            },
            {
                "kode": "CLT-009",
                "nama": "Zara Sweater Wool",
                "kat": "Pakaian",
                "harga": 950000,
                "stok": 6,
                "min": 3,
            },
            {
                "kode": "CLT-010",
                "nama": "Stone Island Jacket",
                "kat": "Pakaian",
                "harga": 3500000,
                "stok": 2,
                "min": 2,
            },
            # Aksesoris (10)
            {
                "kode": "ACC-001",
                "nama": "Nike Socks Pack",
                "kat": "Aksesoris",
                "harga": 150000,
                "stok": 50,
                "min": 15,
            },
            {
                "kode": "ACC-002",
                "nama": "Adidas Cap Classic",
                "kat": "Aksesoris",
                "harga": 280000,
                "stok": 25,
                "min": 8,
            },
            {
                "kode": "ACC-003",
                "nama": "Puma Headband Pro",
                "kat": "Aksesoris",
                "harga": 120000,
                "stok": 30,
                "min": 10,
            },
            {
                "kode": "ACC-004",
                "nama": "NB Wristband Fit",
                "kat": "Aksesoris",
                "harga": 95000,
                "stok": 35,
                "min": 10,
            },
            {
                "kode": "ACC-005",
                "nama": "Uniqlo Wallet Slim",
                "kat": "Aksesoris",
                "harga": 199000,
                "stok": 0,
                "min": 5,
            },
            {
                "kode": "ACC-006",
                "nama": "Zara Belt Leather",
                "kat": "Aksesoris",
                "harga": 450000,
                "stok": 8,
                "min": 4,
            },
            {
                "kode": "ACC-007",
                "nama": "Eiger Cap Outdoor",
                "kat": "Aksesoris",
                "harga": 180000,
                "stok": 20,
                "min": 8,
            },
            {
                "kode": "ACC-008",
                "nama": "Nike Wristband Elite",
                "kat": "Aksesoris",
                "harga": 135000,
                "stok": 3,
                "min": 5,
            },
            {
                "kode": "ACC-009",
                "nama": "Adidas Socks Run",
                "kat": "Aksesoris",
                "harga": 120000,
                "stok": 45,
                "min": 12,
            },
            {
                "kode": "ACC-010",
                "nama": "Stone Island Wallet",
                "kat": "Aksesoris",
                "harga": 1250000,
                "stok": 4,
                "min": 3,
            },
        ]

        for p in products:
            obj, created = Produk.objects.get_or_create(
                kode_produk=p["kode"],
                defaults={
                    "nama": p["nama"],
                    "kategori": kategori[p["kat"]],
                    "supplier": get_supplier_for_product(p["nama"]),
                    "_harga": Decimal(str(p["harga"])),
                    "stok": p["stok"],
                    "stok_minimum": p["min"],
                },
            )

        self.stdout.write(self.style.SUCCESS(f" {Produk.objects.count()} produk"))

    def _seed_supplier(self):
        """Seed 10 supplier sesuai brand."""
        self.stdout.write("  -> Supplier...")

        data = [
            {
                "nama": "Nike Indonesia",
                "no_hp": "081234567890",
                "email": "contact@nike.co.id",
                "alamat": "Jakarta Selatan, DKI Jakarta",
            },
            {
                "nama": "Adidas Indonesia",
                "no_hp": "081234567891",
                "email": "info@adidas.co.id",
                "alamat": "Jakarta Pusat, DKI Jakarta",
            },
            {
                "nama": "Puma Indonesia",
                "no_hp": "081234567892",
                "email": "order@puma.co.id",
                "alamat": "Tangerang, Banten",
            },
            {
                "nama": "New Balance Indonesia",
                "no_hp": "081234567893",
                "email": "sales@newbalance.co.id",
                "alamat": "Bandung, Jawa Barat",
            },
            {
                "nama": "Onitsuka Tiger Indonesia",
                "no_hp": "081234567894",
                "email": "info@onitsukatiger.co.id",
                "alamat": "Surabaya, Jawa Timur",
            },
            {
                "nama": "Eiger Indonesia",
                "no_hp": "081234567895",
                "email": "contact@eigeradventure.com",
                "alamat": "Bandung, Jawa Barat",
            },
            {
                "nama": "Zara Indonesia",
                "no_hp": "081234567896",
                "email": "info@zara.co.id",
                "alamat": "Jakarta Selatan, DKI Jakarta",
            },
            {
                "nama": "Uniqlo Indonesia",
                "no_hp": "081234567897",
                "email": "contact@uniqlo.co.id",
                "alamat": "Jakarta Pusat, DKI Jakarta",
            },
            {
                "nama": "H&M Indonesia",
                "no_hp": "081234567898",
                "email": "info@hm.co.id",
                "alamat": "Jakarta Selatan, DKI Jakarta",
            },
            {
                "nama": "Stone Island Indonesia",
                "no_hp": "081234567899",
                "email": "info@stoneisland.co.id",
                "alamat": "Jakarta Pusat, DKI Jakarta",
            },
        ]

        for item in data:
            Supplier.objects.get_or_create(nama=item["nama"], defaults=item)

        self.stdout.write(self.style.SUCCESS(f" {Supplier.objects.count()} supplier"))

    def _seed_supplier_kategori(self):
        """Seed relasi supplier-kategori berdasarkan brand."""
        self.stdout.write("  -> Supplier-Kategori...")

        sup_map = {s.nama: s for s in Supplier.objects.all()}
        kat_map = {k.nama: k for k in Kategori.objects.all()}

        # Relasi brand → kategori berdasarkan produk yang disuplai
        relations = {
            "Nike Indonesia": ["Sepatu", "Tas", "Pakaian", "Aksesoris"],
            "Adidas Indonesia": ["Sepatu", "Tas", "Pakaian", "Aksesoris"],
            "Puma Indonesia": ["Sepatu", "Tas", "Pakaian", "Aksesoris"],
            "New Balance Indonesia": ["Sepatu", "Aksesoris"],
            "Onitsuka Tiger Indonesia": ["Sepatu"],
            "Eiger Indonesia": ["Sepatu", "Tas", "Aksesoris"],
            "Zara Indonesia": ["Tas", "Pakaian", "Aksesoris"],
            "Uniqlo Indonesia": ["Tas", "Pakaian", "Aksesoris"],
            "H&M Indonesia": ["Tas", "Pakaian"],
            "Stone Island Indonesia": ["Pakaian", "Aksesoris"],
        }

        for sup_nama, kat_list in relations.items():
            if sup_nama in sup_map:
                for kat_nama in kat_list:
                    if kat_nama in kat_map:
                        SupplierKategori.objects.get_or_create(
                            supplier=sup_map[sup_nama],
                            kategori=kat_map[kat_nama],
                        )

        self.stdout.write(
            self.style.SUCCESS(f" {SupplierKategori.objects.count()} relasi")
        )

    def _seed_transaksi(self):
        """Seed 30 transaksi dengan detail."""
        self.stdout.write("  -> Transaksi...")

        produk_list = list(Produk.objects.all())
        customers = [
            "Andi Wijaya",
            "Budi Santoso",
            "Citra Dewi",
            "Diana Putri",
            "Eko Prasetyo",
            "Fina Rahayu",
            "Gita Permata",
            "Hendra Kusuma",
            "Ika Sari",
            "Joko Susilo",
            "Kartika Sari",
            "Lina Marlina",
            "Maya Indah",
            "Nanda Pratama",
            "Olivia Chen",
            "Putri Ayu",
            "Reza Firmansyah",
            "Sinta Dewi",
            "Tono Subroto",
            "Umi Kalsum",
            "Vera Anggraini",
            "Wahyu Hidayat",
            "Xena Maharani",
            "Yudi Hartono",
            "Zahra Amelia",
            "Ahmad Fauzi",
            "Bella Safitri",
            "Chandra Wijaya",
            "Dina Maulida",
            "Erwin Saputra",
        ]
        metodes = ["Cash", "QRIS", "Transfer"]
        statuses = ["SELESAI", "SELESAI", "SELESAI", "SELESAI", "PROSES", "BATAL"]

        today = date.today()

        for i in range(30):
            inv_date = today - timedelta(days=random.randint(0, 90))
            kode = f"INV-{inv_date.strftime('%Y%m%d')}{str(i+1).zfill(3)}"

            transaksi, created = Transaksi.objects.get_or_create(
                kode_invoice=kode,
                defaults={
                    "tanggal": inv_date,
                    "pelanggan_nama": customers[i % len(customers)],
                    "metode": random.choice(metodes),
                    "status": random.choice(statuses),
                    "_total": 0,
                },
            )

            if created:
                # Add 1-4 detail items
                num_items = random.randint(1, 4)
                selected = random.sample(produk_list, min(num_items, len(produk_list)))
                total = Decimal("0")

                for prod in selected:
                    qty = random.randint(1, 3)
                    harga = prod._harga
                    subtotal = qty * harga
                    total += subtotal

                    TransaksiDetail.objects.create(
                        transaksi=transaksi,
                        produk=prod,
                        qty=qty,
                        harga_satuan=harga,
                    )

                transaksi._total = total
                transaksi.save(update_fields=["_total"])

        self.stdout.write(self.style.SUCCESS(f" {Transaksi.objects.count()} transaksi"))

    def _seed_retur(self):
        """Seed 5 retur dari transaksi yang sudah ada."""
        self.stdout.write("  -> Retur...")

        selesai = list(
            Transaksi.objects.filter(status="SELESAI").prefetch_related("detail_set")[
                :5
            ]
        )

        statuses = ["PROSES", "SELESAI", "PROSES", "SELESAI", "DITOLAK"]

        for i, trx in enumerate(selesai):
            kode_retur = f"RTR-{trx.tanggal.strftime('%Y%m%d')}-{str(i+1).zfill(3)}"
            retur_date = trx.tanggal + timedelta(days=random.randint(1, 7))

            alasan_list = [
                "Ukuran tidak sesuai",
                "Warna berbeda dari foto",
                "Produk cacat/rusak",
                "Tidak sesuai ekspektasi",
                "Salah kirim produk",
            ]

            retur, created = Retur.objects.get_or_create(
                kode_retur=kode_retur,
                defaults={
                    "transaksi": trx,
                    "tanggal": retur_date,
                    "alasan": alasan_list[i % len(alasan_list)],
                    "status": statuses[i % len(statuses)],
                    "_total_nilai": 0,
                },
            )

            if created:
                # Ambil 1 detail dari transaksi asli untuk di-retur
                details = list(trx.detail_set.all())
                if details:
                    d = details[0]
                    qty = 1
                    nilai = d.harga_satuan * qty

                    ReturDetail.objects.create(
                        retur=retur,
                        produk=d.produk,
                        qty=qty,
                        nilai=nilai,
                    )

                    retur._total_nilai = nilai
                    retur.save(update_fields=["_total_nilai"])

        self.stdout.write(self.style.SUCCESS(f" {Retur.objects.count()} retur"))
