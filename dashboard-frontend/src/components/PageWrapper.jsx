export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <div className="p-6 bg-[#FAFAFA] dark:bg-[#0a0a0a] m-3 rounded-xl h-[calc(100vh-108px)] overflow-y-auto no-scrollbar">
      {(title || actions) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-dmsans  font-semibold text-gray-800 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="font-dmsans font-light flex items-center gap-2 ">{actions}</div>}
        </div>
      )}  
      {children}
    </div>
  )
}
