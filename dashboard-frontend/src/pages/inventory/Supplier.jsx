import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import PageWrapper from '../../components/PageWrapper'
import api from '../../api/api'
import { MdLocalPhone } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [supRes, supCatRes, catRes] = await Promise.all([
        api.get('master/supplier/'),
        api.get('master/supplier-kategori/'),
        api.get('master/kategori/')
      ])

      const suppliersData = supRes.data.results || supRes.data
      const supCatData = supCatRes.data.results || supCatRes.data
      const catData = catRes.data.results || catRes.data

      const catMap = {}
      catData.forEach(c => {
        catMap[c.id] = c.nama
      })

      const supCatMap = {}
      supCatData.forEach(sc => {
        if (!supCatMap[sc.supplier]) supCatMap[sc.supplier] = []
        supCatMap[sc.supplier].push(catMap[sc.kategori])
      })

      const mappedData = suppliersData.map(s => {
        return {
          id: `SUP-${String(s.id).padStart(3, '0')}`,
          db_id: s.id,
          name: s.nama,
          contact: s.nama,
          phone: s.no_hp,
          email: s.email,
          city: s.alamat,
          categories: supCatMap[s.id] || [],
        }
      })

      setSuppliers(mappedData)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper
      title="Supplier"
      subtitle="Kelola data pemasok produk"
      actions={
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4  py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer">

          <Plus size={15} />
          Tambah Supplier
        </ button>
      }
    >
      {loading ? (
        <div className="flex justify-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {suppliers.map((s, i) => (
            <div key={i} className="bg-white dark:bg-Black-Light rounded-2xl   hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">{s.id}</p>
                  <h4 className="font-bold text-gray-800 dark:text-white text-base mt-0.5">{s.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.contact}</p>
                </div>
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
                          className="w-full text-left rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          Edit
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
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MdLocalPhone size={18} className="shrink-0" />
                  {s.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <IoMail size={18} className="shrink-0" />
                  {s.email}
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <FaLocationDot size={18} className="shrink-0" />
                  {s.city}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-GreyBorder flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {s.categories.map(c => (
                    <span key={c} className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}