import { MdDarkMode, MdLightMode } from "react-icons/md"
import { IoSearch } from "react-icons/io5"
import { FaUser } from "react-icons/fa";

export default function Header({ darkMode, setDarkMode, setActivePage }) {
  return (
    <header className="relative h-18 bg-[#FAFAFA] dark:bg-black flex items-center justify-between px-6 mr-3 ml-3 mt-3 gap-4 rounded-xl shrink-0">
      {/* title */}
      <div className="flex items-center gap-4">
        <h1 className="font-dmsans text-2xl font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h1>
      </div>

      {/* search */}
      <div className="absolute left-1/2 -translate-x-1/2 max-w-md w-full hidden md:flex items-center gap-2 bg-white dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder rounded-xl px-3 py-2">
        <IoSearch
          size={16}
          className="text-gray-400 shrink-0"
        />
        <input
          type="text"
          placeholder="Cari produk, transaksi, dll..."
          className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none flex-1"
        />
      </div>

      {/* right section */}
      <div className="flex items-center gap-2">
        {/* dark mode button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-500 dark:text-gray-300 hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          {darkMode ? (
            <MdLightMode size={24} />
          ) : (
            <MdDarkMode size={24} />
          )}
        </button>

        {/* admin profile */}
        <div
          onClick={() => setActivePage('pengaturan')}
          className="flex items-center justify-center gap-2 cursor-pointer dark:hover:bg-white/10 rounded-xl w-35 h-12 transition-all duration-300 ease-in-out">
          {/* avatar */}
          <div className="w-8 h-8 rounded-full bg-Biru  flex items-center justify-center text-white text-xs font-bold">
            <FaUser size={15} />
          </div>
          {/* admin info */}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
              Luxora
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}