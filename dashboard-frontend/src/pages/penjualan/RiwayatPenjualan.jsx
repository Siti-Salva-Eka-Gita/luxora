import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageWrapper from '../../components/PageWrapper'
import api from '../../api/api'

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

export default function RiwayatPenjualan() {
  const [history, setHistory] = useState([])
  const [salesChart, setSalesChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('laporan/penjualan/')
      const rows = res.data.riwayat_bulanan || []

      const tableData = rows.map(r => ({
        period: r.periode,
        transactions: r.jumlah_transaksi,
        total: `Rp ${Number(r.total_penjualan || 0).toLocaleString('id-ID')}`,
        growth: r.pertumbuhan !== null && r.pertumbuhan !== undefined
          ? `${r.pertumbuhan > 0 ? '+' : ''}${r.pertumbuhan}%`
          : '-',
      }))

      const chartData = [...rows].reverse().map(r => ({
        day: r.periode,
        value: Number(r.total_penjualan || 0),
      }))

      setHistory(tableData)
      setSalesChart(chartData)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper title="Riwayat Penjualan">
        <div className="flex justify-center p-10">
          Loading...
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      title="Riwayat Penjualan"
      subtitle="Rekap penjualan per periode"

    >
      <div className="bg-white dark:bg-Black-Light rounded-2xl p-5 mb-6 border border-gray-200 dark:border-GreyBorder">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium font-poppins text-gray-800 dark:text-white">Grafik Penjualan</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={salesChart} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatRupiah} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5}
              dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-Black-Light rounded-2xl border border-gray-200 dark:border-GreyBorder overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 dark:border-GreyBorder border-neutral-200 dark:bg-Black-Light">
              {['Periode', 'Jumlah Transaksi', 'Total Penjualan', 'Pertumbuhan'].map(h => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 dark:bg-white/3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {history.map((row, i) => {
              const isUp = row.growth.startsWith('+')

              return (
                <tr key={i} className={`border-t border-neutral-100 dark:border-GreyBorder/50 transition-colors ${i % 2 === 0 ? 'bg-grey-50 dark:bg-Black-Light' : 'bg-gray-50 dark:bg-white/3'} hover:bg-gray-50 dark:hover:bg-white/3`}
                >
                  <td className="px-5 py-3 font-semibold text-gray-800 dark:text-white">{row.period}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{row.transactions} transaksi</td>
                  <td className="px-5 py-3 font-bold text-gray-800 dark:text-gray-200">{row.total}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`font-semibold ${row.growth === '-'
                        ? 'text-gray-400'
                        : isUp
                          ? 'text-emerald-600'
                          : 'text-red-500'
                        }`}
                    >
                      {row.growth}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  )
}