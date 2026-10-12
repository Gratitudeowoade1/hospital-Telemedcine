import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, FolderOpen, BarChart2, Clock } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/ehr', label: 'EHR', icon: FolderOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/history', label: 'History', icon: Clock },
]

const Sidebar = () => (
  <aside className="w-64 bg-sidebar h-screen flex flex-col shrink-0">
    <div className="px-6 py-5 border-b border-white/10">
      <span className="text-white font-semibold text-lg tracking-tight">MediDesk</span>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-primary text-white font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
