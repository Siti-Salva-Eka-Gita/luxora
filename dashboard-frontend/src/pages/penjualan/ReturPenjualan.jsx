import { useState, useEffect } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import PageWrapper from '../../components/PageWrapper'
import Badge from '../../components/Badge'
import api from '../../api/api'
import { IoSearch } from "react-icons/io5"


export default function ReturPenjualan() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, value: 0 })
  const [search, setSearch] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      // Retur sudah include detail (nested) dari serializer
      const res = await api.get('retur/')
      const data = res.data.results || res.data

      let totalValue = 0
      let pendingCount = 0
      const mapped = []

      data.forEach(r => {
        if (r.status === 'PROSES') pendingCount++

        const dateObj = new Date(r.tanggal)
        const dateStr = !isNaN(dateObj.getTime())
          ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : r.tanggal

        const details = r.detail || []

        if (details.length > 0) {
          details.forEach(d => {
            totalValue += Number(d.nilai || 0)
            mapped.push({
              id: r.kode_retur || `RTR-${r.id}`,
              invoice: r.kode_invoice || `INV-${r.transaksi}`,
              date: dateStr,
              customer: r.pelanggan_nama || 'Unknown',
              product: d.produk_nama || 'Unknown',
              qty: d.qty,
              reason: r.alasan || '-',
              total: Number(d.nilai || 0),
              status: r.status || 'PROSES',
            })
          })
        } else {
          mapped.push({
            id: r.kode_retur || `RTR-${r.id}`,
            invoice: r.kode_invoice || `INV-${r.transaksi}`,
            date: dateStr,
            customer: r.pelanggan_nama || 'Unknown',
            product: r.produk_nama_pertama || '-',
            qty: r.jumlah_item || 0,
            reason: r.alasan || '-',
            total: r.total_nilai || 0,
            status: r.status || 'PROSES',
          })
          totalValue += Number(r.total_nilai || 0)
        }
      })

      setReturns(mapped)
      setStats({ total: data.length, pending: pendingCount, value: totalValue })
    } catch (error) {
      console.error('Error fetching returns:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = returns.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.product.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper title="Retur Penjualan" subtitle="Kelola pengembalian barang dari pelanggan"
    >
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Retur Bulan Ini', value: stats.total, color: 'text-gray-800 dark:text-white' },
          { label: 'Sedang Diproses', value: stats.pending, color: 'text-amber-600' },
          { label: 'Total Nilai Retur', value: `Rp ${stats.value.toLocaleString('id-ID')}`, color: 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-Black-Light rounded-2xl p-4  text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>



      <div className="flex items-center bg-white dark:bg-Black-Light gap-2 border border-white dark:border-Black-Light rounded-xl px-3 py-2 mb-4 w-full focus-within:border-gray-300 dark:focus-within:border-GreyBorder transition-all">
        <IoSearch
          size={16}
          className="text-gray-400 shrink-0"
        />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari pelanggan atau produk..."
          className="bg-transparent  text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none flex-1" />
      </div>

      {loading ? <div className="flex justify-center p-10">Loading...</div> : (
        <div className="bg-white dark:bg-Black-Light rounded-2xl border border-neutral-200 dark:border-GreyBorder overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-GreyBorder bg-gray-50 dark:bg-Black-Light">
                  {['ID Retur', 'ID Pembelian', 'Tanggal', 'Pelanggan', 'Produk', 'Item', 'Alasan', 'Nilai', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 dark:bg-white/3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} className={`border-t border-neutral-100 dark:border-GreyBorder/50 transition-colors ${i % 2 === 0 ? 'bg-grey-50 dark:bg-Black-Light' : 'bg-gray-50 dark:bg-white/3'} hover:bg-gray-50 dark:hover:bg-white/3`}>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400 text-xs font-semibold">{row.id}</td>
                    <td className="px-4 py-3 text-blue-600 dark:text-blue-400 text-xs font-semibold">{row.invoice}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{row.customer}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.product}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">{row.qty}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.reason}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3"><Badge label={row.status} type={row.status.toLowerCase()} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}