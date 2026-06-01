import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import PageWrapper from '../../components/PageWrapper'
import api from '../../api/api'
import { IoSearch } from "react-icons/io5"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { LuBoxes } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


const ProductImage = ({ id, name }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const localImg = localStorage.getItem(`product_image_${id}`);
    if (localImg) {
      setImgSrc(localImg);
      setError(false);
    } else {
      setImgSrc(`/images/products/${id}.png`);
      setError(false);
    }
  }, [id]);

  return (
    <div className="w-30 h-30 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden text-2xl shrink-0">
      {!error && imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => {
            if (imgSrc.startsWith('data:')) {
              setError(true);
            } else if (imgSrc.endsWith('.png')) {
              setImgSrc(`/images/products/${id}.jpg`);
            } else {
              setError(true);
            }
          }}
        />
      ) : (
        <LuBoxes className="text-gray-400" />
      )}
    </div>
  );
};

export default function Produk() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['Semua'])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('Semua')
  const [loading, setLoading] = useState(true)

  const [isEditMode, setIsEditMode] = useState(false)
  const [editProductId, setEditProductId] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoriesDb, setCategoriesDb] = useState([])
  const [suppliersDb, setSuppliersDb] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    supplier: '',
    harga: '',
    stok: '',
    image: null,
    imagePreview: '',
    imageName: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchAllData = async (url) => {
    let results = []
    let nextUrl = url

    while (nextUrl) {
      const res = await api.get(nextUrl)
      const data = res.data.results || res.data

      if (res.data.results) {
        results = [...results, ...res.data.results]
        nextUrl = res.data.next
      } else {
        results = data
        nextUrl = null
      }
    }

    return results
  }

  const fetchData = async () => {
    try {
      const [produkData, kategoriData, supplierData] = await Promise.all([
        fetchAllData('master/produk/'),
        fetchAllData('master/kategori/'),
        fetchAllData('master/supplier/')
      ])

      const catMap = {}
      const catNames = ['Semua']

      kategoriData.forEach(c => {
        catMap[c.id] = c.nama
        catNames.push(c.nama)
      })

      const mappedData = produkData.map(p => {
        const stockStatus = p.stok === 0 ? 'Habis' : (p.stok <= p.stok_minimum ? 'Rendah' : 'Tersedia')
        return {
          id: p.kode_produk || `PRD-${String(p.id).padStart(3, '0')}`,
          db_id: p.id,
          name: p.nama,
          category: catMap[p.kategori] || 'Lainnya',
          category_id: String(p.kategori || ''),
          supplier_id: String(p.supplier || ''),
          harga_raw: p.harga || 0,
          price: `Rp ${Number(p.harga || 0).toLocaleString('id-ID')}`,
          stock: p.stok,
          unit: 'pcs',
          status: stockStatus
        }
      })

      setProducts(mappedData)
      setCategories(catNames)
      setCategoriesDb(kategoriData)
      setSuppliersDb(supplierData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
          imageName: file.name
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    if (!isEditMode && !formData.imagePreview) {
      setErrorMsg('Gambar produk wajib dipilih!')
      setSubmitting(false)
      return
    }

    try {
      const payload = {
        nama: formData.nama,
        kategori: formData.kategori,
        supplier: formData.supplier ? parseInt(formData.supplier) : null,
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok),
        stok_minimum: 5,
        image_base64: formData.imagePreview || null,
        image_name: formData.imageName || null
      }

      let res
      if (isEditMode) {
        res = await api.patch(
          `master/produk/${editProductId}/`,
          payload
        )
      } else {
        res = await api.post(
          'master/produk/',
          payload
        )
      }

      const product = res.data
      if (formData.imagePreview && product.kode_produk) {
        localStorage.setItem(
          `product_image_${product.kode_produk}`,
          formData.imagePreview
        )
      }

      setIsModalOpen(false)
      setIsEditMode(false)
      setEditProductId(null)

      setFormData({
        nama: '',
        kategori: '',
        supplier: '',
        harga: '',
        stok: '',
        image: null,
        imagePreview: '',
        imageName: ''
      })

      fetchData()
    } catch (err) {
      console.error("Gagal menyimpan produk:", err)
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan produk."

      setErrorMsg(errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete Product (Hard Delete with custom warning overlay modal)
  const [deleteProductData, setDeleteProductData] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const confirmDelete = (dbId, productCode, productName) => {
    setDeleteProductData({ dbId, productCode, productName, errorMsg: '' })
  }

  const executeDelete = async () => {
    if (!deleteProductData) return
    setIsDeleting(true)

    try {
      await api.delete(`master/produk/${deleteProductData.dbId}/`)
      // Also remove local storage image if cached
      if (deleteProductData.productCode) {
        localStorage.removeItem(`product_image_${deleteProductData.productCode}`)
      }
      // Close modal
      setDeleteProductData(null)
      // Refresh list
      fetchData()
    } catch (err) {
      console.error("Gagal menghapus produk:", err)
      const msg = err.response?.data?.detail || err.response?.data?.message || "Terjadi kesalahan saat menghapus produk."
      setDeleteProductData(prev => ({ ...prev, errorMsg: msg }))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (product) => {
    setIsEditMode(true)
    setEditProductId(product.db_id)

    const cachedImg = localStorage.getItem(`product_image_${product.id}`)

    setFormData({
      nama: product.name,
      kategori: product.category_id,
      supplier: product.supplier_id,
      harga: product.harga_raw,
      stok: product.stock,
      image: null,
      imagePreview: cachedImg || '',
      imageName: cachedImg ? 'Gambar tersimpan' : ''
    })
    setIsModalOpen(true)
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'Semua' || p.category === cat
    return matchSearch && matchCat
  })

  return (
    <PageWrapper
      title="Produk"
      subtitle="Kelola data produk toko"
      actions={
        <button
          onClick={() => {
            setIsModalOpen(true)
            setIsEditMode(false)
            setEditProductId(null)
            setFormData({ nama: '', kategori: '', supplier: '', harga: '', stok: '', image: null, imagePreview: '', imageName: '' })
          }}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4  py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={15} />
          Tambah Produk
        </button>
      }
    >
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center bg-white dark:bg-Black-Light gap-2 border border-white dark:border-Black-Light rounded-xl px-3 py-2 flex-1 min-w-48 focus-within:border-gray-300 dark:focus-within:border-GreyBorder transition-all">
          <IoSearch size={16} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none flex-1"
          />
        </div>
        <div className="dark:bg-Black-Light bg-white rounded-xl p-2 flex items-center gap-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-2  font-poppins rounded-lg text-xs font-mnormal transition-colors ${cat === c ? 'bg-gray-50 dark:bg-white/10 dark:text-white text-gray-600 cursor-pointer' : 'bg-white dark:bg-Black-Light  dark:border-GreyBorder text-gray-600 dark:text-gray-300 dark:hover:bg-white/6 hover:bg-gray-50 cursor-pointer'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white dark:bg-Black-Light rounded-2xl  hover:shadow-md transition-all p-4">
              <div className='flex gap-4'>

                <div className="flex items-start justify-between mb-3">
                  <ProductImage id={p.id} name={p.name} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{p.id}</p>
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm mt-1 leading-snug">{p.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                  <p className="text-base font-bold dark:text-white mt-2">{p.price}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-GreyBorder">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Stok: <strong className="text-gray-700 dark:text-gray-300">{p.stock} {p.unit}</strong></span>
                <div className="flex items-center gap-1">
                  <Menu as="div" className="relative inline-block">
                    <MenuButton className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                      <BsThreeDotsVertical />
                    </MenuButton>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-xl bg-white dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder shadow-xl p-1 transition data-closed:scale-95 data-closed:opacity-0"
                    >
                      <MenuItem>
                        <button
                          onClick={() => handleEdit(p)}
                          className="w-full text-left rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          Edit
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => confirmDelete(p.db_id, p.id, p.name)}
                          className="w-full text-left rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Produk - Premium Glassmorphism UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setIsModalOpen(false)
              setIsEditMode(false)
              setEditProductId(null)
              setFormData({ nama: '', kategori: '', supplier: '', harga: '', stok: '', image: null, imagePreview: '', imageName: '' })
            }}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-Black-Light border border-gray-100 dark:border-GreyBorder rounded-3xl w-[1200px] h-[700px] shadow-2xl p-6 overflow-hidden transform transition-all duration-300 z-10 animate-[scaleIn_0.2s_ease-out]">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Isi detail produk baru di bawah ini</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  setIsEditMode(false)
                  setEditProductId(null)
                  setFormData({ nama: '', kategori: '', supplier: '', harga: '', stok: '', image: null, imagePreview: '', imageName: '' })
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs font-semibold text-red-500 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex ">
                {/* Local Image Picker & Preview */}
                <div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2 w-100 h-120 mr-3 ">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Gambar Produk</label>
                    <div className="relative border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-blue-500 rounded-2xl p-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 dark:bg-white/2 hover:bg-blue-50/5 dark:hover:bg-blue-500/5 group min-h-36 h-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {formData.imagePreview ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={formData.imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-GreyBorder shadow-sm"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{formData.imageName || 'Gambar Terpilih'}</p>
                            <p className="text-xs text-gray-400 mt-1">Klik atau seret file untuk mengganti</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-115 transition-transform duration-300">
                            <Plus size={18} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Pilih file gambar</p>
                            <p className="text-xs text-gray-400 mt-1">Mendukung PNG, JPG atau JPEG dari komputer Anda</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Nama Produk */}
                <div className='flex flex-col gap-4.5'>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Nama Produk</label>
                    <div className="flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-GreyBorder rounded-xl px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
                      <input
                        type="text"
                        placeholder="Masukkan nama produk..."
                        value={formData.nama}
                        onChange={e => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                        className="bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none flex-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Pilihan Kategori (Pill Buttons) */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Kategori</label>
                    <div className="flex flex-wrap gap-2">
                      {categoriesDb.map(c => {
                        const isSelected = String(formData.kategori) === String(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, kategori: String(c.id) }))}
                            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/15'
                              : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-GreyBorder text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                              }`}
                          >
                            {c.nama}
                          </button>
                        );
                      })}
                    </div>
                    {/* Hidden input to enforce HTML5 form validation */}
                    <input
                      type="text"
                      className="sr-only"
                      value={formData.kategori}
                      onChange={() => { }}
                      required
                    />
                  </div>

                  {/* Pilihan Supplier (Pill Buttons) */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Supplier</label>
                    <div className="flex flex-wrap gap-2">
                      {suppliersDb.map(s => {
                        const isSelected = String(formData.supplier) === String(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, supplier: String(s.id) }))}
                            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/15'
                              : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-GreyBorder text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                              }`}
                          >
                            {s.nama}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Harga */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Harga (Rupiah)</label>
                    <div className="flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-GreyBorder rounded-xl px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
                      <span className="text-sm text-gray-400 dark:text-gray-500 font-semibold mr-1 select-none">Rp</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.harga}
                        onChange={e => setFormData(prev => ({ ...prev, harga: e.target.value }))}
                        className="bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none flex-1"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Stok */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Jumlah Stok</label>
                    <div className="flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-GreyBorder rounded-xl px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.stok}
                        onChange={e => setFormData(prev => ({ ...prev, stok: e.target.value }))}
                        className="bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none flex-1"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-GreyBorder">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setIsEditMode(false)
                    setEditProductId(null)
                    setFormData({ nama: '', kategori: '', supplier: '', harga: '', stok: '', image: null, imagePreview: '', imageName: '' })

                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500/50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  {submitting
                    ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...')
                    : (isEditMode ? 'Update Produk' : 'Simpan Produk')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Produk - Premium Warning UI */}
      {deleteProductData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isDeleting && setDeleteProductData(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-Black-Light border border-red-100/20 dark:border-red-500/10 rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-hidden transform transition-all duration-300 z-10 animate-[scaleIn_0.2s_ease-out]">

            {/* Modal Header / Icon */}
            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                <X size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Hapus Produk Permanen?</h3>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-1 px-4">
                  Apakah Anda yakin ingin menghapus produk <strong className="text-gray-700 dark:text-gray-200">{deleteProductData.productName}</strong> ({deleteProductData.productCode}) secara permanen? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            {/* Error Message inside modal */}
            {deleteProductData.errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs font-semibold text-red-500 text-center">
                {deleteProductData.errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-GreyBorder">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteProductData(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-500/50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus Permanen'}
              </button>
            </div>

          </div>
        </div>
      )}
    </PageWrapper>
  )
}