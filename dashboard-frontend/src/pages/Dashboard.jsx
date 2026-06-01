import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import api from '../api/api'
import { IoMdCart } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import { LuBoxes } from "react-icons/lu";
import { MdInventory } from "react-icons/md";

const formatRupiah = (val) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(0)}jt`
  if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`
  return val
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-GreyBorder rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-bold text-blue-600">Rp {payload[0].value.toLocaleString('id')}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard({ setActivePage }) {
  const [period, setPeriod] = useState('Semua Waktu')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    stats: { total_penjualan: 0, total_transaksi: 0, total_produk: 0, stok_rendah: 0 },
    salesChart: [],
    stockPie: [],
    recentSales: [],
    lowStock: []
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('dashboard/')
      const d = res.data

      // summary cards
      const summary = d.summary || {}

      // grafik penjualan — dari grafik_penjualan
      const salesChart = (d.grafik_penjualan || []).map(item => ({
        day: item.periode,
        value: item.total || 0,
      }))

      // distribusi stok — dari distribusi_stok
      const stockPie = (d.distribusi_stok || []).map(item => {
        const colorMap = {
          'Stok Tersedia': '#10b981',
          'Stok Rendah': '#f59e0b',
          'Stok Habis': '#ef4444',
        }
        return {
          name: item.label,
          value: item.jumlah,
          color: colorMap[item.label] || '#d1d5db',
        }
      })

      // transaksi terbaru
      const recentSales = (d.transaksi_terbaru || []).map(t => ({
        invoice: t.kode_invoice,
        date: t.tanggal,
        customer: t.pelanggan_nama,
        total: `Rp ${Number(t.total || 0).toLocaleString('id-ID')}`,
        status: t.status,
      }))

      // produk stok rendah
      const lowStock = (d.produk_stok_rendah || []).map(p => ({
        name: p.nama,
        category: p['kategori__nama'] || 'Unknown',
        stock: p.stok,
        minStock: p.stok_minimum,
        status: p.stok === 0 ? 'HABIS' : 'RENDAH',
      }))

      setData({
        stats: {
          total_penjualan: summary.total_penjualan || 0,
          total_transaksi: summary.total_transaksi || 0,
          total_produk: summary.total_produk || 0,
          stok_rendah: summary.stok_rendah || 0,
        },
        salesChart,
        stockPie,
        recentSales,
        lowStock,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6 flex justify-center text-gray-500">Loading Dashboard...</div>

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] dark:bg-black m-3 rounded-xl h-[calc(100vh-108px)] overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
        <StatCard title="Total Penjualan" value={`Rp ${data.stats.total_penjualan.toLocaleString('id-ID')}`} info="Bulan ini" icon={<IoMdCart className="text-white" />} iconBg="bg-Biru" />
        <StatCard title="Total Transaksi" value={data.stats.total_transaksi} info="Bulan ini" icon={<GrTransaction className="text-white" />} iconBg="bg-Biru" />
        <StatCard title="Total Produk" value={data.stats.total_produk} icon={<LuBoxes className="text-white" />} iconBg="bg-Biru" />
        <StatCard title="Stok Rendah" value={data.stats.stok_rendah} icon={<MdInventory className="text-white" />} iconBg="bg-Biru" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 ">
        <div className="lg:col-span-3 bg-white dark:bg-Black-Light rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium font-dmsans text-gray-800 dark:text-white text-lg">Grafik Penjualan</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.salesChart} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatRupiah} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-Black-Light rounded-2xl p-5">
          <h3 className="font-medium font-dmsans text-gray-800 dark:text-white mb-4 text-lg">Stok Produk</h3>
          <div className="flex flex-col items-center">
            <div className="relative">
              <PieChart width={180} height={180}>
                <Pie data={data.stockPie} cx={85} cy={85} innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {data.stockPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-800 dark:text-white">{data.stats.total_produk}</span>
                <span className="text-xs text-gray-400">Total Produk</span>
              </div>
            </div>
            <div className="w-full space-y-2 mt-2">
              {data.stockPie.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {item.value} ({data.stats.total_produk > 0 ? ((item.value / data.stats.total_produk) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-Black-Light rounded-2xl  overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 ">
            <h3 className="font-medium font-dmsans text-gray-800 dark:text-white text-lg">Penjualan Terbaru</h3>
            <button
              onClick={() => setActivePage('transaksi')}
              className="font-medium text-sm font-dmsans text-Biru dark:text-blue-400 dark:hover:text-Biru transition-all cursor-pointer"
            >
              Lihat semua
            </button>
          </div>
          <div className="overflow-x-auto border ml-5 mr-5 mb-5 border-b border-neutral-200 dark:border-GreyBorder dark:bg-Black-Light rounded-xl">
            <table className="w-full text-sm ">
              <thead>
                <tr className="border-b bg-gray-50 border-neutral-200 dark:bg-white/3 dark:border-GreyBorder">
                  {['ID Pembelian', 'Tanggal', 'Pelanggan', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left p-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentSales.map((row, i) => (
                  <tr key={i} className={`border-t border-neutral-100 dark:border-GreyBorder/50 transition-colors ${i % 2 === 0 ? 'bg-grey-50 dark:bg-Black-Light' : 'bg-gray-50 dark:bg-white/3'} hover:bg-gray-50 dark:hover:bg-white/3`}
                  >
                    <td className="px-3 py-2 font-semibold text-xs text-blue-600 dark:text-blue-400 whitespace-nowrap">{row.invoice}</td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{row.customer}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">{row.total}</td>
                    <td className="px-3 py-2"><Badge label={row.status} type={row.status.toLowerCase()} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-Black-Light rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 ">
            <h3 className="font-medium font-dmsans text-gray-800 dark:text-white text-lg">Stok Rendah</h3>
            <button
              onClick={() => setActivePage('stok')}
              className="font-medium text-sm font-dmsans text-Biru dark:text-blue-400 dark:hover:text-Biru transition-all cursor-pointer"
            >Lihat Semua</button>
          </div>
          <div className="overflow-x-auto border ml-5 mr-5 mb-5 border-b border-neutral-200 dark:border-GreyBorder dark:bg-Black-Light rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-grey-50 border-neutral-200 dark:border-GreyBorder">
                  {['Produk', 'Kategori', 'Stok', 'Stok Minimum', 'Status'].map(h => (
                    <th key={h} className="bg-gray-50 text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 dark:bg-white/3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.lowStock.map((row, i) => (
                  <tr key={i} className={`border-t border-neutral-100 dark:border-GreyBorder/50 transition-colors ${i % 2 === 0 ? 'bg-grey-50 dark:bg-Black-Light' : 'bg-gray-50 dark:bg-white/3'} hover:bg-gray-50 dark:hover:bg-white/3`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.category}</td>
                    <td className="px-5 py-2 text-gray-700 dark:text-gray-300 font-semibold">{row.stock}</td>
                    <td className="px-5 py-2 text-gray-500 dark:text-gray-400">{row.minStock}</td>
                    <td className="px-5 py-2"><Badge label={row.status} type={row.status.toLowerCase()} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}