import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Share2, MonitorPlay, ChevronDown, Asterisk } from 'lucide-react'
import { clinicLinks, financeLinks, bottomLinks } from '../../data/navLinks'

const NavItem = ({ to, label, icon: Icon, showLabels }) => (
  <NavLink
    to={to}
    title={!showLabels ? label : undefined}
    className={({ isActive }) =>
      `flex items-center w-full text-sm cursor-pointer transition-all duration-300 ease-in-out border-l-[3px] ${
        showLabels ? 'gap-3 px-4 py-2.5' : 'justify-center px-0 py-3'
      } ${
        isActive
          ? 'border-[#10AD69] bg-[#f0fdf6] text-[#10AD69] font-semibold'
          : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`
    }
  >
    <Icon size={18} className="shrink-0" />
    {showLabels && <span className="truncate">{label}</span>}
  </NavLink>
)

const Sidebar = ({ isOpen: sidebarOpen }) => {
  const [navExpanded, setNavExpanded] = useState(true)
  const showLabels = sidebarOpen

  return (
    <aside
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)]
        bg-white border-r border-gray-200
        flex flex-col overflow-x-hidden overflow-y-hidden
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-[260px] z-50' : 'w-14 z-30'}
      `}
    >
      {/* ── AI DIAGNOSIS CARD ── */}
      <Link
        to="/ai-diagnosis"
        title={!showLabels ? 'AI Diagnosis' : undefined}
        className={`flex items-center gap-3 my-3 p-2.5 rounded-xl border border-gray-100
          hover:bg-gray-50 shrink-0 overflow-hidden transition-all duration-300 cursor-pointer
          ${showLabels ? 'mx-3 justify-start' : 'mx-auto w-10 justify-center'}
        `}
      >
        <div className="w-9 h-9 rounded-lg bg-[#FDECEA] flex items-center justify-center shrink-0">
          <MonitorPlay size={18} color="#e05c5c" />
        </div>
        {showLabels && (
          <span className="font-bold text-gray-800 text-sm truncate">AI Diagnosis</span>
        )}
      </Link>

      {/* ── SCROLLABLE NAV ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* Dashboard heading */}
        {showLabels ? (
          <div className="flex items-center justify-between px-5 py-2">
            <Link
              to="/dashboard"
              className="font-bold text-gray-800 text-base hover:text-[#10AD69] transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => setNavExpanded(e => !e)}
              className="text-gray-500 hover:text-gray-800 p-0.5 rounded cursor-pointer shrink-0"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${navExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
          </div>
        ) : (
          <NavLink
            to="/dashboard"
            title="Dashboard"
            className={({ isActive }) =>
              `flex justify-center w-full py-3 border-l-[3px] transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-[#10AD69] bg-[#f0fdf6] text-[#10AD69]'
                  : 'border-transparent text-gray-500 hover:bg-gray-100'
              }`
            }
          >
            <Share2 size={18} className="shrink-0" />
          </NavLink>
        )}

        {/* CLINIC + FINANCE — collapsible, always show icons on strip */}
        {(navExpanded || !showLabels) && (
          <>
            {/* CLINIC label */}
            {showLabels && (
              <div className="flex items-center gap-2 px-5 pt-3 pb-1">
                <span className="w-2 h-2 rounded-full bg-[#10AD69] shrink-0" />
                <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                  Clinic
                </span>
              </div>
            )}
            {clinicLinks.map(link => (
              <NavItem key={link.to} {...link} showLabels={showLabels} />
            ))}

            {/* FINANCE label */}
            {showLabels && (
              <div className="px-5 pt-4 pb-1">
                <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                  Finance
                </span>
              </div>
            )}
            {financeLinks.map(link => (
              <NavItem key={link.to} {...link} showLabels={showLabels} />
            ))}
          </>
        )}

        {/* Divider */}
        <hr className="border-gray-200 mx-3 my-2" />

        {/* Emergency Alert — always dark red, never green active style */}
        {showLabels ? (
          <NavLink
            to="/emergency"
            className="flex items-center gap-2 bg-[#7B0000] hover:bg-red-800 transition-colors duration-200 rounded-xl mx-3 mb-3 px-4 py-3 cursor-pointer"
          >
            <Asterisk size={20} className="text-white shrink-0" />
            <span className="text-white font-semibold text-sm">Emergency Alert</span>
          </NavLink>
        ) : (
          <NavLink
            to="/emergency"
            title="Emergency Alert"
            className="flex justify-center w-full py-3 cursor-pointer bg-[#7B0000] hover:bg-red-800 transition-colors duration-200"
          >
            <Asterisk size={20} className="text-white shrink-0" />
          </NavLink>
        )}

        {/* Bottom links */}
        {bottomLinks.map(link => (
          <NavItem key={link.to} {...link} showLabels={showLabels} />
        ))}
      </div>

      {/* ── PROMOTIONAL CARD ── */}
      {showLabels && (
        <Link
          to="/appointments"
          className="m-3 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow shrink-0 block"
        >
          <div className="bg-[#FFF5F5] h-[90px] w-full flex items-center justify-center">
            <span className="text-xs text-gray-400 italic">[Medical Team Illustration]</span>
          </div>
          <div className="px-4 py-3 bg-white">
            <p className="font-bold text-[#10AD69] text-sm truncate">Make an Appointment</p>
            <p className="text-xs text-[#10AD69] truncate">Book healthcare here →</p>
          </div>
        </Link>
      )}
    </aside>
  )
}

export default Sidebar
