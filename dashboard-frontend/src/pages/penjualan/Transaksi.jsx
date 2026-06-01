import { useState, useEffect } from 'react'
import PageWrapper from '../../components/PageWrapper'
import Badge from '../../components/Badge'
import api from '../../api/api'
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoSearch } from "react-icons/io5"
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { IoMdClose } from "react-icons/io";


export default function Transaksi() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('transaksi/')
      const data = res.data.results || res.data

      const mappedData = data.map(t => {
        const dateObj = new Date(t.tanggal)
        const dateStr = !isNaN(dateObj.getTime())
          ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : t.tanggal

        return {
          invoice: t.kode_invoice || `INV-${t.tanggal?.replace(/-/g, '') || '00000000'}-${String(t.id).padStart(3, '0')}`,
          db_id: t.id,
          date: dateStr,
          customer: t.pelanggan_nama || 'Unknown',
          items: t.jumlah_item || 1,
          total: `Rp ${Number(t.total || 0).toLocaleString('id-ID')}`,
          payment: t.metode || 'Cash',
          status: t.status || 'SELESAI',
          products: t.detail?.map(d => d.produk_nama).join(', ') || '-',
          details: t.detail || [],
        }
      })

      setTransactions(mappedData)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // untuk filtering
  const filtered = transactions.filter(t => {
    const matchSearch =
      t.invoice.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase())

    const matchStatus = statusFilter === '' || t.status === statusFilter
    const matchPayment = paymentFilter === '' || t.payment === paymentFilter

    return matchSearch && matchStatus && matchPayment
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <PageWrapper
      title="Transaksi"
      subtitle="Kelola semua transaksi penjualan"
    >
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center bg-white dark:bg-Black-Light gap-2 border border-white dark:border-Black-Light rounded-xl px-3 py-2 flex-1 min-w-48 focus-within:border-gray-300 dark:focus-within:border-GreyBorder transition-all">
          <IoSearch size={16} className="text-gray-400 shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Cari invoice atau pelanggan..."
            className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none flex-1" />
        </div>

        <Menu as="div" className="relative inline-block">
          <MenuButton className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all cursor-pointer">
            {statusFilter === ''
              ? 'Semua Status'
              : statusFilter === 'SELESAI'
                ? 'Selesai'
                : statusFilter === 'PROSES'
                  ? 'Diproses'
                  : 'Batal'}

            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-2xl bg-white dark:bg-Black-Light border border-gray-200 dark:border-white/10 shadow-xl p-1 transition data-closed:scale-95 data-closed:opacity-0 "
          >
            {[
              { label: 'Semua Status', value: '' },
              { label: 'Selesai', value: 'SELESAI' },
              { label: 'Diproses', value: 'PROSES' },
              { label: 'Batal', value: 'BATAL' },
            ].map((item) => (
              <MenuItem key={item.value}>
                <button
                  onClick={() => {
                    setStatusFilter(item.value)
                    setCurrentPage(1)
                  }}
                  className={`w-full text-left rounded-xl px-4 py-2.5 text-sm transition-all my-0.5 ${statusFilter === item.value
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 cursor-pointer'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer'
                    }`}
                >
                  {item.label}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        <Menu as="div" className="relative inline-block">
          <MenuButton className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all cursor-pointer">
            {paymentFilter === ''
              ? 'Semua Pembayaran'
              : paymentFilter}

            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-2xl bg-white dark:bg-Black-Light border border-gray-200 dark:border-white/10 shadow-xl p-1 transition data-closed:scale-95 data-closed:opacity-0"
          >
            {[
              { label: 'Semua Pembayaran', value: '' },
              { label: 'Cash', value: 'Cash' },
              { label: 'QRIS', value: 'QRIS' },
              { label: 'Transfer', value: 'Transfer' },
            ].map((item) => (
              <MenuItem key={item.value}>
                <button
                  onClick={() => {
                    setPaymentFilter(item.value)
                    setCurrentPage(1)
                  }}
                  className={`w-full text-left rounded-xl px-4 py-2.5 text-sm transition-all my-0.5 ${paymentFilter === item.value
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 cursor-pointer'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer'
                    }`}
                >
                  {item.label}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      {loading ? <div className="flex justify-center p-10">Loading...</div> : (
        <div className="bg-white dark:bg-Black-Light rounded-2xl border border-gray-200 dark:border-GreyBorder overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-GreyBorder bg-gray-50 dark:bg-Black-Light">
                  {['ID Pembelian', 'Tanggal', 'Pelanggan', 'Nama Produk', 'Item', 'Total', 'Pembayaran', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap dark:bg-white/3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-neutral-100 dark:border-GreyBorder/50 transition-colors ${i % 2 === 0 ? 'bg-grey-50 dark:bg-Black-Light' : 'bg-gray-50 dark:bg-white/3'} hover:bg-gray-50 dark:hover:bg-white/3`}
                  >
                    <td className="px-5 py-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">{row.invoice}</td>
                    <td className="px-5 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.date}</td>
                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{row.customer}</td>
                    <td className="px-5 py-2 text-gray-600 dark:text-gray-400 max-w-52 truncate">{row.products}</td>
                    <td className="px-5 py-2 text-gray-600 dark:text-gray-400">{row.items}</td>
                    <td className="px-5 py-2 text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">{row.total}</td>
                    <td className="px-5 py-2 text-gray-500 dark:text-gray-400">{row.payment}</td>
                    <td className="px-5 py-2"><Badge label={row.status} type={row.status.toLowerCase()} /></td>
                    <td className="p-1">
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
                              onClick={() => {
                                setSelected(row)
                                setShowModal(true)
                              }}
                              className="w-full text-left rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                            >
                              Detail Pesanan
                            </button>
                          </MenuItem>

                          <MenuItem>
                            <button
                              className="w-full text-left rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                            >
                              Hapus
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3.5 border-t border-neutral-200 dark:border-GreyBorder flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Menampilkan {currentData.length} dari {filtered.length} transaksi</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"><GrFormPrevious size={15} /></button>
              <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold">{currentPage}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"><MdNavigateNext size={15} /></button>
            </div>
          </div>
        </div>
      )}

      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 no-scrollbar">
          <div className="bg-white dark:bg-Black-Light w-full max-w-md rounded-2xl shadow-lg p-6 pt-0 relative dark:text-white max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="sticky top-0 bg-white dark:bg-Black-Light z-10 p-4 flex items-center justify-center">
              <h2 className="text-center font-bold text-lg">
                DETAIL PESANAN
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 dark:hover:text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 p-1 rounded-lg transition-all cursor-pointer"
              >
                <IoMdClose size={22} />
              </button>
            </div>
            <div className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">ID Pembelian</span>
                <span className="font-semibold">{selected.invoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tanggal</span>
                <span>{selected.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Pelanggan</span>
                <span>{selected.customer}</span>
              </div>
            </div>

            <div className="border-t my-5 border-gray-200 dark:border-gray-700" />

            <div className="text-sm">
              <p className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Produk yang Dibeli:</p>
              <div className="space-y-3">
                {selected.details && selected.details.length > 0 ? (
                  selected.details.map((item, idx) => (
                    <div key={idx} className="flex flex-col bg-gray-50 dark:bg-white/5 p-3 rounded-xl gap-2">
                      <span className="font-medium">{item.produk_nama}</span>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{item.qty} x Rp {Number(item.harga_satuan || 0).toLocaleString('id-ID')}</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Rp {Number(item.subtotal || (item.qty * item.harga_satuan) || 0).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Detail produk tidak tersedia</p>
                )}
              </div>
            </div>

            <div className="border-t my-5 border-gray-200 dark:border-gray-700" />

            <div className="text-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Total Item</span>
                <span>{selected.items}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Pembayaran</span>
                <span>{selected.payment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <Badge label={selected.status} type={selected.status.toLowerCase()} />
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-lg dark:text-white">{selected.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}