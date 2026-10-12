import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Menu, X, Search, HelpCircle, Maximize2, Minimize2,
  Bell, Settings, CheckCircle, ChevronRight, Share2,
} from 'lucide-react'
import useGlobalSearch from '../../hooks/useGlobalSearch'

const NOTIFICATIONS = [
  { id: 1, title: 'New appointment booked',   desc: 'Patient John D. scheduled for 3pm',    time: '2 mins ago'  },
  { id: 2, title: 'Lab results ready',         desc: 'EHR updated for patient #1042',         time: '15 mins ago' },
  { id: 3, title: 'Billing invoice generated', desc: 'Invoice #2041 is ready for review',     time: '1 hr ago'    },
  { id: 4, title: 'System maintenance',        desc: 'Scheduled downtime Sunday 2–4am',       time: '3 hrs ago'   },
  { id: 5, title: 'New patient registered',    desc: 'Welcome Sarah M. to the portal',        time: '5 hrs ago'   },
  { id: 6, title: 'Support ticket resolved',   desc: 'Ticket #882 has been closed',           time: 'Yesterday'   },
]

/* ─── small helpers ──────────────────────────────────────────────────────── */

const IconBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="border border-gray-200 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
  >
    {children}
  </button>
)

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

/* ─── DropdownPortal ─────────────────────────────────────────────────────── */
// Renders children at fixed coords directly below the anchor element.
// Recalculates only when `open` flips to true (not on every render).
const DropdownPortal = ({ anchorRef, open, children }) => {
  const [style, setStyle] = useState({ position: 'fixed', top: 0, right: 0, zIndex: 9999, visibility: 'hidden' })

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return
    const r = anchorRef.current.getBoundingClientRect()
    // right-align to anchor's right edge, clamped to viewport
    const rightOffset = Math.max(8, window.innerWidth - r.right)
    setStyle({
      position: 'fixed',
      top: r.bottom + 6,
      right: rightOffset,
      zIndex: 9999,
      visibility: 'visible',
      maxWidth: 'calc(100vw - 16px)',
    })
  }, [open, anchorRef])

  if (!open) return null
  return <div style={style}>{children}</div>
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
const Navbar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate()

  // search
  const [query, setQuery]         = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef                 = useRef(null)
  const results                   = useGlobalSearch(query)

  // panels — only one open at a time
  const [openPanel, setOpenPanel] = useState(null)
  const toggle = (panel) => setOpenPanel(p => p === panel ? null : panel)

  // fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false)
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen()
    else document.exitFullscreen()
  }

  // refs for anchors + outside-click containers
  const helpBtnRef     = useRef(null); const helpContRef     = useRef(null)
  const notifBtnRef    = useRef(null); const notifContRef    = useRef(null)
  const profileBtnRef  = useRef(null); const profileContRef  = useRef(null)

  useOutsideClick(helpContRef,    () => openPanel === 'help'    && setOpenPanel(null))
  useOutsideClick(notifContRef,   () => openPanel === 'notif'   && setOpenPanel(null))
  useOutsideClick(profileContRef, () => openPanel === 'profile' && setOpenPanel(null))
  useOutsideClick(searchRef,      () => setSearchOpen(false))

  const handleSearchSelect = (path) => {
    navigate(path); setQuery(''); setSearchOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setOpenPanel(null)
    navigate('/login', { replace: true })
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center">

      {/* ── LOGO — width tracks sidebar open/closed ── */}
      <Link
        to="/dashboard"
        className={`
          flex items-center gap-2 h-full px-3 border-r border-gray-200 shrink-0
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[260px]' : 'w-14'}
        `}
      >
        <Share2 size={20} color="#10AD69" className="shrink-0" />
        <span
          className={`text-base font-bold whitespace-nowrap transition-all duration-300 origin-left
            ${isOpen ? 'opacity-100 scale-x-100 max-w-[200px]' : 'opacity-0 scale-x-0 max-w-0'}
          `}
        >
          <span className="text-gray-900">Medi</span>
          <span className="text-[#10AD69]">Care</span>
        </span>
      </Link>

      {/* ── CENTRE — hamburger + search ── */}
      <div className="flex items-center gap-2 flex-1 min-w-0 px-3">

        {/* hamburger */}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors shrink-0 cursor-pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Search — always present, scales with available width */}
        <div ref={searchRef} className="relative flex-1 min-w-0">
          <div className={`flex items-center gap-2 bg-[#f1f5f3] rounded-full px-3 py-2 w-full transition-all ${searchOpen ? 'ring-1 ring-[#10AD69]' : ''}`}>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search…"
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1 min-w-0 w-0"
            />
            {query
              ? <button onMouseDown={() => { setQuery(''); setSearchOpen(false) }} className="shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"><X size={14} /></button>
              : <Search size={14} color="#10AD69" className="shrink-0" />
            }
          </div>

          {/* results — sits in own stacking context via inline style */}
          {searchOpen && query.trim() && (
            <div
              className="absolute top-full mt-2 left-0 w-full min-w-[240px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-y-auto max-h-72"
              style={{ zIndex: 9999 }}
            >
              {results.length > 0 ? (
                <>
                  <p className="text-[10px] uppercase text-gray-400 font-semibold px-4 pt-3 pb-1 tracking-wider">Pages</p>
                  {results.map(({ label, path, keywords }) => (
                    <button
                      key={path}
                      onMouseDown={() => handleSearchSelect(path)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0fdf6] cursor-pointer text-left group"
                    >
                      <Search size={13} className="text-[#10AD69] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#10AD69]">{label}</p>
                        <p className="text-xs text-gray-400 truncate">{(keywords || []).slice(0, 3).join(', ')}</p>
                      </div>
                      <ChevronRight size={13} className="text-gray-300 shrink-0" />
                    </button>
                  ))}
                </>
              ) : (
                <div className="py-6 text-center px-4">
                  <Search size={22} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No results for <strong>&ldquo;{query}&rdquo;</strong></p>
                  <p className="text-xs text-gray-400 mt-0.5">Try a page name or keyword</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT ICONS ── */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 pr-3">

        {/* Help — desktop only */}
        <div ref={helpContRef} className="hidden md:block">
          <div ref={helpBtnRef}>
            <IconBtn onClick={() => toggle('help')}>
              <HelpCircle size={17} color="#6B7280" />
            </IconBtn>
          </div>
          <DropdownPortal anchorRef={helpBtnRef} open={openPanel === 'help'}>
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 w-44 py-1 overflow-hidden">
              <a href="https://docs.example.com" target="_blank" rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Documentation <ChevronRight size={14} />
              </a>
              <button onClick={() => { navigate('/support'); setOpenPanel(null) }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Contact Support <ChevronRight size={14} />
              </button>
            </div>
          </DropdownPortal>
        </div>

        {/* Fullscreen — desktop only */}
        <div className="hidden md:block">
          <IconBtn onClick={handleFullscreen}>
            {isFullscreen ? <Minimize2 size={17} color="#F59E0B" /> : <Maximize2 size={17} color="#F59E0B" />}
          </IconBtn>
        </div>

        {/* Notifications — always */}
        <div ref={notifContRef}>
          <div ref={notifBtnRef} className="relative">
            <IconBtn onClick={() => toggle('notif')}>
              <Bell size={17} color="#10AD69" />
            </IconBtn>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">3</span>
          </div>
          <DropdownPortal anchorRef={notifBtnRef} open={openPanel === 'notif'}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-[min(320px,calc(100vw-16px))] max-h-[360px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                <span className="font-bold text-gray-800 text-sm">Notifications</span>
                <button className="text-xs text-[#10AD69] hover:underline cursor-pointer">Mark all as read</button>
              </div>
              <div className="overflow-y-auto flex-1">
                {NOTIFICATIONS.map(({ id, title, desc, time }) => (
                  <div key={id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-[#f0fdf6] flex items-center justify-center shrink-0">
                      <CheckCircle size={14} color="#10AD69" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
                      <p className="text-xs text-gray-500 truncate">{desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => { navigate('/notifications'); setOpenPanel(null) }}
                className="text-xs text-[#10AD69] text-center py-3 hover:underline cursor-pointer border-t border-gray-100 shrink-0"
              >
                View all notifications
              </button>
            </div>
          </DropdownPortal>
        </div>

        {/* Settings — desktop only */}
        <div className="hidden md:block">
          <IconBtn onClick={() => navigate('/settings')}>
            <Settings size={17} color="#EF4444" />
          </IconBtn>
        </div>

        {/* Profile — always */}
        <div ref={profileContRef}>
          <div ref={profileBtnRef}>
            <button
              onClick={() => toggle('profile')}
              className="flex items-center gap-2 pl-1 pr-1 sm:pl-2 sm:pr-2 py-1 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-gray-800 whitespace-nowrap">Ade Josephine</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wide">Admin</p>
              </div>
              <img src="https://i.pravatar.cc/40" alt="avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 shrink-0"
              />
            </button>
          </div>
          <DropdownPortal anchorRef={profileBtnRef} open={openPanel === 'profile'}>
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 w-52 py-1 overflow-hidden">
              <button onClick={() => { navigate('/profile'); setOpenPanel(null) }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                My Profile <ChevronRight size={14} />
              </button>
              <button onClick={() => { navigate('/settings'); setOpenPanel(null) }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Account Settings <ChevronRight size={14} />
              </button>

              {/* Mobile-only extras */}
              <div className="md:hidden">
                <hr className="border-gray-100 my-1" />
                <a href="https://docs.example.com" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <HelpCircle size={14} className="text-gray-400 shrink-0" /> Documentation
                </a>
                <button onClick={() => { navigate('/support'); setOpenPanel(null) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer text-left"
                >
                  <HelpCircle size={14} className="text-gray-400 shrink-0" /> Contact Support
                </button>
                <button onClick={() => { navigate('/settings'); setOpenPanel(null) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer text-left"
                >
                  <Settings size={14} className="text-gray-400 shrink-0" /> Settings
                </button>
              </div>

              <hr className="border-gray-100 my-1" />
              <button onClick={handleLogout}
                className="w-full px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 cursor-pointer text-left"
              >
                Logout
              </button>
            </div>
          </DropdownPortal>
        </div>

      </div>
    </header>
  )
}

export default Navbar
