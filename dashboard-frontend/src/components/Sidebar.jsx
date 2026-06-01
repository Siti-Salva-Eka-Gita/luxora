import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  RiDashboardHorizontalLine,
  RiDashboardHorizontalFill,
  RiShoppingCartLine,
  RiShoppingCartFill,
  RiBox3Line,
  RiBox3Fill,
} from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { GrTransaction } from "react-icons/gr";
import { RiFileList3Line } from "react-icons/ri";
import { RiArrowGoBackLine } from "react-icons/ri";
import { RiArchiveStackLine } from "react-icons/ri";
import { RiPriceTag3Line } from "react-icons/ri";
import { RiTruckLine } from "react-icons/ri";

export default function Sidebar({ activePage, setActivePage, darkMode, setDarkMode }) {
  return (
    <aside className="font-dmsans w-52 bg-white dark:bg-Black-Light flex flex-col shrink-0 mt-3 ml-3 mb-3 rounded-xl">
      {/* Logo */}
      <div className="px-5 py-4 text-black dark:text-Light">
        <div className="flex items-center gap-2.5">
          <span className="ml-13 font-bold text-lg tracking-tight">Luxora</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => setActivePage('dashboard')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'dashboard'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiDashboardHorizontalLine size={18} />
          Dashboard
        </button>

        {/* Penjualan */}
        <p className="px-3 mt-4 mb-2 text-[10.5px] tracking-widest dark:text-gray-400 font-semibold text-gray-500 uppercase">
          Penjualan
        </p>

        <button
          onClick={() => setActivePage('transaksi')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'transaksi'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><GrTransaction size={18} />
          Transaksi
        </button>

        <button
          onClick={() => setActivePage('riwayat_penjualan')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'riwayat_penjualan'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiFileList3Line size={18} />
          Riwayat Penjualan
        </button>

        <button
          onClick={() => setActivePage('retur_penjualan')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'retur_penjualan'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiArrowGoBackLine size={18} />
          Retur Penjualan
        </button>

        {/* Inventory */}
        <p className="px-3 mt-4 mb-2 text-[10.5px] tracking-widest dark:text-gray-400 font-semibold text-gray-500 uppercase">
          Inventory
        </p>

        <button
          onClick={() => setActivePage('produk')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'produk'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiBox3Line size={18} />
          Produk
        </button>

        <button
          onClick={() => setActivePage('stok')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'stok'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiArchiveStackLine size={18} />
          Stok
        </button>

        <button
          onClick={() => setActivePage('kategori')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'kategori'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiPriceTag3Line size={18} />
          Kategori
        </button>

        <button
          onClick={() => setActivePage('supplier')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'supplier'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><RiTruckLine size={18} />
          Supplier
        </button>

        {/* Pengaturan */}
        <p className="px-3 mt-4 mb-2 text-[10.5px] tracking-widest dark:text-gray-400 font-semibold text-gray-500 uppercase">
          General
        </p>
        <button
          onClick={() => setActivePage('pengaturan')}
          className={`w-full flex gap-2 items-center text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === 'pengaturan'
            ? 'bg-Biru text-white font-semibold cursor-pointer'
            : 'text-gray-500 dark:text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer'
            }`}
        ><IoSettingsOutline size={17} />
          Pengaturan
        </button>
      </nav>
    </aside>
  )
}