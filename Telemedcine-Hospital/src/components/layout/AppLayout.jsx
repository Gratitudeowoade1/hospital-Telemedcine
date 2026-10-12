import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from '../Navbar/Navbar'

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 768)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // always close on mobile entry, always open on desktop entry
      setIsOpen(!mobile)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />

      {/* Backdrop — mobile only, renders when off-canvas is open */}
      {isMobile && isOpen && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-black/40 z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Sidebar isOpen={isOpen} />

      {/*
        Desktop open:   ml-[260px]
        Desktop closed: ml-14
        Mobile closed:  ml-14  — icon-strip is fixed, content sits beside it
        Mobile open:    ml-14  — off-canvas overlays, content does NOT shift
      */}
      <main
        className={`pt-16 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
          isMobile
            ? 'ml-14'
            : isOpen ? 'ml-[260px]' : 'ml-14'
        }`}
      >
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
