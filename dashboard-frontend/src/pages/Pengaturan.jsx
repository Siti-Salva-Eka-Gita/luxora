import { Save } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { IoMdSave } from "react-icons/io";

export default function Pengaturan() {
  return (
    <PageWrapper
      title="Pengaturan"
      subtitle="Konfigurasi sistem dan preferensi toko"
    >
      <div className="bg-Grey-Light dark:bg-black">
        <div className="bg-white dark:bg-Black-Light rounded-2xl border border-gray-100 dark:border-GreyBorder p-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-5">
            Informasi Toko
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                Nama Toko
              </label>
              <input
                defaultValue="Luxora"
                className="w-full bg-gray-50 dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                Nama Pemilik
              </label>
              <input
                defaultValue="Admin Utama"
                className="w-full bg-gray-50 dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                Nomor Telepon
              </label>
              <input
                defaultValue="0812-3456-7890"
                className="w-full bg-gray-50 dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                Email
              </label>
              <input
                defaultValue="admin@luxora.id"
                className="w-full bg-gray-50 dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                Alamat
              </label>
              <textarea
                defaultValue="Surabaya, Jawa Timur"
                rows={3}
                className="w-full bg-gray-50 dark:bg-Black-Light border border-gray-200 dark:border-GreyBorder rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all resize-none"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
              <IoMdSave size={18}/>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}