from rest_framework import serializers
from core.serializers import BaseSerializer
from .models import Kategori, Produk, Supplier, SupplierKategori


class KategoriSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = Kategori
        fields = ["id", "nama", "deskripsi", "created_at", "updated_at"]


class ProdukSerializer(BaseSerializer):
    harga = serializers.IntegerField(required=False)
    status_stok = serializers.CharField(read_only=True)
    kategori_nama = serializers.CharField(read_only=True)
    supplier_nama = serializers.CharField(read_only=True)
    image_base64 = serializers.CharField(
        required=False, write_only=True, allow_null=True, allow_blank=True
    )
    image_name = serializers.CharField(
        required=False, write_only=True, allow_null=True, allow_blank=True
    )

    class Meta(BaseSerializer.Meta):
        model = Produk
        fields = [
            "id",
            "kode_produk",
            "nama",
            "kategori",
            "kategori_nama",
            "supplier",
            "supplier_nama",
            "harga",
            "stok",
            "stok_minimum",
            "status_stok",
            "created_at",
            "updated_at",
            "image_base64",
            "image_name",
        ]
        extra_kwargs = {"kode_produk": {"required": False, "allow_blank": True}}

    def create(self, validated_data):
        harga = validated_data.pop("harga", 0)
        image_base64 = validated_data.pop("image_base64", None)
        image_name = validated_data.pop("image_name", None)
        kategori = validated_data.get("kategori")
        prefix = "PRD"
        if kategori:
            kat_nama = kategori.nama.lower()
            if "sepatu" in kat_nama:
                prefix = "SHO"
            elif "tas" in kat_nama:
                prefix = "BAG"
            elif "pakaian" in kat_nama:
                prefix = "CLT"
            elif "aksesoris" in kat_nama:
                prefix = "ACC"
            else:
                prefix = (kategori.nama[:3]).upper()

        kode_produk = validated_data.get("kode_produk")
        if not kode_produk:
            pattern = f"{prefix}-"
            last_product = (
                Produk.objects.filter(kode_produk__startswith=pattern)
                .order_by("-kode_produk")
                .first()
            )
            next_num = 1
            if last_product:
                try:
                    num_part = last_product.kode_produk.split("-")[-1]
                    next_num = int(num_part) + 1
                except (ValueError, IndexError):
                    pass
            validated_data["kode_produk"] = f"{prefix}-{str(next_num).zfill(3)}"

        instance = Produk.objects.create(**validated_data)
        instance.set_harga(harga)
        instance.save()
        # ubah string Base64 menjadi file gambar asli
        if image_base64:
            try:
                import base64
                import os

                if "," in image_base64:
                    header, data = image_base64.split(",", 1)
                else:
                    header, data = "", image_base64

                img_data = base64.b64decode(data)

                # tentukan ekstensi file
                ext = "png"
                if image_name and "." in image_name:
                    ext = image_name.split(".")[-1].lower()
                elif "jpeg" in header or "jpg" in header:
                    ext = "jpg"

                target_dir = r"C:\Users\wandy\OneDrive\Documents\DASHBOARD\dashboard-frontend\public\images\products"
                os.makedirs(target_dir, exist_ok=True)

                filename = f"{instance.kode_produk}.{ext}"
                filepath = os.path.join(target_dir, filename)

                with open(filepath, "wb") as f:
                    f.write(img_data)
            except Exception as e:
                print(f"Error saving product image: {e}")

        return instance

    def update(self, instance, validated_data):
        harga = validated_data.pop("harga", None)
        if harga is not None:
            instance.set_harga(harga)

        image_base64 = validated_data.pop("image_base64", None)
        image_name = validated_data.pop("image_name", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if image_base64:
            try:
                import base64
                import os

                if "," in image_base64:
                    header, data = image_base64.split(",", 1)
                else:
                    header, data = "", image_base64

                img_data = base64.b64decode(data)

                ext = "png"
                if image_name and "." in image_name:
                    ext = image_name.split(".")[-1].lower()
                elif "jpeg" in header or "jpg" in header:
                    ext = "jpg"

                target_dir = r"C:\Users\wandy\OneDrive\Documents\DASHBOARD\dashboard-frontend\public\images\products"
                os.makedirs(target_dir, exist_ok=True)

                filename = f"{instance.kode_produk}.{ext}"
                filepath = os.path.join(target_dir, filename)

                other_ext = "jpg" if ext == "png" else "png"
                other_file = os.path.join(
                    target_dir, f"{instance.kode_produk}.{other_ext}"
                )
                if os.path.exists(other_file):
                    try:
                        os.remove(other_file)
                    except:
                        pass

                with open(filepath, "wb") as f:
                    f.write(img_data)
            except Exception as e:
                print(f"Error updating product image: {e}")

        return instance


class SupplierSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = Supplier
        fields = [
            "id",
            "nama",
            "no_hp",
            "email",
            "alamat",
            "created_at",
            "updated_at",
        ]


class SupplierKategoriSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = SupplierKategori
        fields = ["id", "supplier", "kategori", "created_at", "updated_at"]
