# Luxora - Fashion Store Management System

Aplikasi berbasis web untuk mengelola operasional toko fashion "Luxora". Aplikasi ini dibuat untuk membantu usaha atau perusahaan dalam mengelola produk, stok, supplier, dan transaksi secara terstruktur sehingga dapat mendukung berjalannya aktivitas yang lebih efektif.

## Anggota Kelompok
- Wandy Jesaya Simanjuntak (25051204059)

## Fitur Utama
- Manajemen Produk
• CRUD produk lengkap: tambah, lihat, edit, dan hapus produk.
• Upload gambar produk dengan preview sebelum disimpan.
• Produk dapat dihubungkan ke kategori dan supplier melalui antarmuka yang sederhana.

- Sistem Stok & Inventori
• Status stok otomatis: Tersedia, Rendah, atau Habis.
• Pengelolaan harga dan stok terpusat untuk menjaga konsistensi data.

- Manajemen Kategori & Supplier
• Pengelolaan data kategori dan supplier.
• Produk terhubung langsung dengan kategori dan supplier terkait.

- Transaksi & Retur
• Mendukung pencatatan transaksi penjualan.
• Mendukung pengelolaan data retur barang.

---

## Persiapan Awal

Sebelum mulai menjalankan aplikasi ini, pastikan device telah terinstal:
1. **Python** (versi 3.8 ke atas)
2. **MySQL Server** (bisa menggunakan XAMPP, Laragon, atau MySQL server lain)
   link : https://github.com/leokhoa/laragon/releases/tag/6.0.0
4. **Node.js**
5. Download source code dalam zip dari github lalu ekstrak
6. Hasil ekstrak **wajib** di simpan dalam direktori C:\DASHBOARD


## Langkah 1: Database (MySQL)

Aplikasi ini menggunakan MySQL sebagai database utamanya *(Konfigurasi bawaan aplikasi ini menggunakan Laragon)*

1. Buka aplikasi pengelola MySQL (phpMyAdmin, DBeaver, atau MySQL Workbench).
2. Buat database baru bernama **`luxora_db`**.
3. Pastikan *username* MySQL Anda adalah `root` dengan *password* dikosongkan (default XAMPP/Laragon).
   *(Jika menggunakan password, maka perlu diubah pada file `dashboard-backend/config/settings.py` di bagian `DATABASES` sesuai dengan password yang digunakan)*.



## Langkah 2: Menjalankan Backend (Django)

Backend berada di dalam folder `dashboard-backend`. Ikuti langkah berikut melalui terminal/CMD:

1. Buka terminal dan masuk ke folder dashboard-backend:
   
   ```bash
   cd dashboard-backend
   ```
2. Buat dan aktifkan **Virtual Environment**:
   
   ```bash
   # Di Windows
   python -m venv venv
   venv\Scripts\activate

   # Di Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install semua *dependencies* pada requirements.txt:
   
   ```bash
   pip install -r requirements.txt
   ```
4. Buat kerangka tabel di dalam database:
   
   ```bash
   python manage.py migrate
   ```
5. Generate Data Dummy (Seeder):
    
   ```bash
   python manage.py seed_data
   ```
   *(Perintah ini akan secara otomatis mengisi database dengan data Kategori, Produk, Supplier, Transaksi, dan Retur).*
6. Jalankan server lokal:
    
   ```bash
   python manage.py runserver
   ```
   *Backend sekarang berjalan di `http://127.0.0.1:8000/`*

---

## Langkah 3: Menjalankan Frontend (React + Vite)

Frontend berada di dalam folder `dashboard-frontend`. Buka terminal/CMD **BARU** (jangan tutup terminal backend karena akan menghentikan server), lalu ikuti langkah ini:

1. Masuk ke folder frontend:
   
   ```bash
   cd dashboard-frontend
   ```
3. Install semua *dependencies*:
   
   ```bash
   npm install
   ```
5. Jalankan server:
   
   ```bash
   npm run dev
   ```
7. Buka *link* yang muncul di terminal (**`http://localhost:5173`**) dan otomatis akan membuka browser

---

## 💡 Troubleshooting Umum

- **Error: "Access denied for user 'root'@'localhost'"**
  Artinya password MySQL di komputer Anda tidak kosong. Buka `dashboard-backend/config/settings.py`, cari bagian `DATABASES`, dan isi kolom `'PASSWORD'` sesuai dengan password MySQL Anda.
  
- **Error: "Unknown database 'luxora_db'"**
  Artinya Anda belum membuat database di MySQL. Silakan kembali ke Langkah 1.

- **Gambar Produk Tidak Muncul**
  Gambar produk pada aplikasi ini disimpan sementara di _localStorage_ browser dan _folder_ `public/images/products/`, sehingga di pindahkan  _project_ ini, beberapa gambar bawaan mungkin tidak muncul.
