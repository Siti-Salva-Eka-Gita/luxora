import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import PageWrapper from '../../components/PageWrapper'
import api from '../../api/api'
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GiDiamondRing } from "react-icons/gi";
import { IoShirtSharp } from "react-icons/io5";
import { GiRunningShoe } from "react-icons/gi";
import { FaBagShopping } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Kategori() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchAllProducts = async () => {
    let all = []
    let url = 'master/produk/'

    while (url) {
      const res = await api.get(url)
      const data = res.data

      all = [...all, ...(data.results || data)]
      url = data.next ? data.next.replace(api.defaults.baseURL, '') : null
    }

    return all
  }

  const fetchCategories = async () => {
    try {
      const [catRes, prodData] = await Promise.all([
        api.get('master/kategori/'),
        fetchAllProducts()
      ])

      const catData = catRes.data.results || catRes.data

      const productCountMap = {}
      prodData.forEach(p => {
        const kategoriId = p.kategori
        if (!productCountMap[kategoriId]) {
          productCountMap[kategoriId] = 0
        }
        productCountMap[kategoriId]++
      })

      const colors = [
        'bg-Biru', 'bg-Biru', 'bg-Biru', 'bg-Biru',
      ]

      const icons = [<GiDiamondRing className='text-white' />, <IoShirtSharp className='text-white' />, <GiRunningShoe className='text-white' />, <FaBagShopping className='text-white' />]

      const mappedData = catData.map((cat, index) => ({
        id: `KAT-${String(cat.id).padStart(3, '0')}`,
        db_id: cat.id,
        name: cat.nama,
        desc: cat.deskripsi,
        products: productCountMap[cat.id] || 0,
        icon: icons[index % icons.length],
        color: colors[index % colors.length]
      }))

      setCategories(mappedData)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper
      title="Kategori"
      subtitle="Kelola kategori produk"
      actions={
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4  py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer">
          <Plus size={15} />
          Tambah Kategori
        </button>
      }
    >
      {loading ? (
        <div className="flex justify-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-Black-Light rounded-2xl   hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-3xl mb-3`}>
                  {cat.icon}
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
              <p className="text-xs text-gray-400">{cat.id}</p>
              <h4 className="font-bold text-gray-800 dark:text-white text-lg mt-0.5">{cat.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.desc}</p>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-GreyBorder">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <strong className="text-gray-700 dark:text-gray-300">{cat.products}</strong> produk
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}