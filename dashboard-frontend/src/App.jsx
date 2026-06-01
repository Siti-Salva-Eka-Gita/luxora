import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Transaksi from './pages/penjualan/Transaksi'
import RiwayatPenjualan from './pages/penjualan/RiwayatPenjualan'
import ReturPenjualan from './pages/penjualan/ReturPenjualan'
import Produk from './pages/inventory/Produk'
import Stok from './pages/inventory/Stok'
import Kategori from './pages/inventory/Kategori'
import Supplier from './pages/inventory/Supplier'

import Pengaturan from './pages/Pengaturan'

const pageMap = {
  dashboard: Dashboard,
  transaksi: Transaksi,
  riwayat_penjualan: RiwayatPenjualan,
  retur_penjualan: ReturPenjualan,
  produk: Produk,
  stok: Stok,
  kategori: Kategori,
  supplier: Supplier,

  pengaturan: Pengaturan,
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')

  // Read from localStorage on initial load
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode')
      if (savedMode !== null) {
        return savedMode === 'true'
      }
    }
    return false
  })

  // Apply class and save to localStorage on change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const PageComponent = pageMap[activePage] || Dashboard

  return (
    <div className="flex h-screen bg-Light dark:bg-Black-Light font-dmsans overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activePage={activePage} darkMode={darkMode} setDarkMode={setDarkMode} setActivePage={setActivePage} />
        <main className="flex-1 overflow-y-auto bg-Light dark:bg-Black-Light">
          <PageComponent setActivePage={setActivePage} />
        </main>
      </div>
    </div>
  )
}
