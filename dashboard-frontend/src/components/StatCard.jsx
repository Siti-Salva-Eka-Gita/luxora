export default function StatCard({ title, value, info, icon, iconBg }) {
  return (
    <div className="bg-Light dark:bg-Black-Light rounded-2xl p-5 font-dmsans">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1 leading-tight">
            {value}
          </p>

          {info && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-gray-400">{info}</span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center text-2xl shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  )
}