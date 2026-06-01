import { useState, useEffect } from 'react'
import PageWrapper from '../../components/PageWrapper'
import Badge from '../../components/Badge'
import api from '../../api/api'
import { IoSearch } from "react-icons/io5"
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa"
import { LuBoxes } from "react-icons/lu"

export default function Stok({ setActivePage }) {
  const [produkList, setProdukList] = useState([])
  const [stats, setStats] = useState({ totalSku: 0, available: 0, low: 0, out: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('master/produk/')
      const produkData = res.data.results || res.data

      let avail = 0, low = 0, out = 0

      produkData.forEach(p => {
        avail += Number(p.stok || 0)
        if (p.status_stok === 'habis') out++
        else if (p.status_stok === 'rendah') low++
      })

      setStats({ totalSku: produkData.length, available: avail, low, out })
      setProdukList(produkData)
    } catch (error) {
      console.error("Error fetching produk:", error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = produkList.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.kode_produk.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper
      title="Stok"
      subtitle="Informasi stok produk saat ini"

    >
      {loading ? (
        <div className="flex justify-center p-10">Loading...</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Produk', value: stats.totalSku, icon: <LuBoxes className="text-white" />, color: 'bg-Biru dark:bg-blue-900/20' },
              { label: 'Stok Tersedia', value: stats.available, icon: <FaCheckCircle className="text-white" />, color: 'bg-green-500' },
              { label: 'Stok Rendah', value: stats.low, icon: <FaExclamationTriangle className="text-white" />, color: 'bg-yellow-400' },
              { label: 'Stok Habis', value: stats.out, icon: <FaTimesCircle className="text-white" />, color: 'bg-red-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-Black-Light rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center text-xl shrink-0`}>{s.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabel Informasi Stok */}
          <div className="bg-white dark:bg-Black-Light rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="font-medium font-poppins text-gray-800 dark:text-white">Informasi Stok</h3>
              <div className="flex items-center bg-white dark:bg-Black-Light gap-2 border border-white dark:border-Black-Light rounded-xl px-3 py-1.5 focus-within:border-gray-300 dark:focus-within:border-GreyBorder transition-all">
                <IoSearch size={16} className="text-gray-400 shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none w-40"
                />
              </div>
            </div>

            <div className="overflow-x-auto border mx-5 mb-5 border-Neutral-200 dark:border-GreyBorder rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-Neutral-200 dark:border-GreyBorder bg-gray-50 dark:bg-white/3">
                    {['ID Produk', 'Nama Produk', 'Kategori', 'Stok Saat ini', 'Stok Minimum', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    return (
                      <tr key={i} className={`border-t border-neutral-100 dark:border-GreyBorder/50 transition-colors ${i % 2 === 0 ? 'bg-grey-50 dark:bg-Black-Light' : 'bg-gray-50 dark:bg-white/3'} hover:bg-gray-50 dark:hover:bg-white/3`}>
                        <td className="px-5 py-2 text-xs text-gray-400">{p.kode_produk}</td>
                        <td className="px-5 py-2 font-medium text-gray-800 dark:text-white whitespace-nowrap">{p.nama}</td>
                        <td className="px-5 py-2 text-gray-500 dark:text-gray-400">{p.kategori_nama || '-'}</td>
                        <td className="px-5 py-2 font-bold text-gray-800 dark:text-gray-200">{p.stok}</td>
                        <td className="px-5 py-2 font-bold text-gray-800 dark:text-gray-200">{p.stok_minimum}</td>
                        <td className="px-5 py-2">
                          <Badge label={p.status_stok} type={p.status_stok.toLowerCase()} />
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">Produk tidak ditemukan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  )
}