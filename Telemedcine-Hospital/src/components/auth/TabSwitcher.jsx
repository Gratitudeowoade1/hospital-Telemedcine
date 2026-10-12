const TabSwitcher = ({ tabs, active, onChange }) => (
  <div className="flex border-b border-gray-200 mb-6">
    {tabs.map(({ key, label, icon: Icon }) => {
      const isActive = active === key
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors focus:outline-none ${
            isActive
              ? 'text-[#10AD69] border-b-2 border-[#10AD69] -mb-px'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      )
    })}
  </div>
)

export default TabSwitcher
