const variants = {
  selesai: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  proses: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  batal: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  rendah: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  habis: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  normal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  ditolak: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export default function Badge({ label, type = 'normal' }) {
  const cls = variants[type?.toLowerCase()?.trim()] || variants.normal
  return (
    <span className={`flex items-center justify-center p-1 rounded-md text-[12px] font-semibold ${cls}`}>
      {label}
    </span>
  )
}
