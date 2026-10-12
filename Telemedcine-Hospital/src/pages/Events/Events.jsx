import { useState, useEffect } from 'react'
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  Clock,
  MapPin,
  User,
  QrCode,
  Download,
  CheckCircle,
  X,
  Edit2,
  Trash2,
  Bell,
  Calendar,
  AlertCircle
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts'

// Initial dummy events data
const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Mental Health & Wellness Webinar',
    category: 'Webinar',
    date: '2026-07-10',
    time: '14:00 - 15:30',
    speaker: 'Dr. Helen Vance',
    location: 'Zoom (Virtual)',
    description: 'Learn practical mindfulness strategies and mental health wellness tips for healthcare practitioners and patients alike.',
    capacity: 100,
    registered: 45,
    isRegistered: false,
    attendees: ['Akin Yemi', 'Funke Akindele', 'Polly Richardson']
  },
  {
    id: 2,
    title: 'Advanced Cardiology Seminar',
    category: 'Seminar',
    date: '2026-07-15',
    time: '09:00 - 12:00',
    speaker: 'Dr. Richard Henderson',
    location: 'Main Auditorium (Block B)',
    description: 'A deep-dive seminar discussing modern techniques in vascular surgeries and diagnostic cardiology.',
    capacity: 50,
    registered: 48,
    isRegistered: true,
    attendees: ['Akin Yemi', 'Grace Yinusa', 'John Doe']
  },
  {
    id: 3,
    title: 'Pediatric Emergency Response Training',
    category: 'Training',
    date: '2026-07-22',
    time: '10:30 - 14:00',
    speaker: 'Dr. Sarah Myers',
    location: 'Simulation Lab (Room 304)',
    description: 'Hands-on clinical training for urgent pediatric resuscitations and allergy response protocols.',
    capacity: 30,
    registered: 12,
    isRegistered: false,
    attendees: ['Jane Smith', 'Bob Johnson']
  },
  {
    id: 4,
    title: 'Global Healthcare Innovation Summit',
    category: 'Conference',
    date: '2026-08-05',
    time: '08:00 - 17:00',
    speaker: 'Dr. Akin Yemi',
    location: 'Eko Hotels Conference Hall',
    description: 'Annual gathering of regional experts addressing technological integrations and AI diagnosis implementations.',
    capacity: 200,
    registered: 120,
    isRegistered: false,
    attendees: ['Alice Green', 'Charlie Brown']
  }
]

const CATEGORIES = ['All', 'Webinar', 'Seminar', 'Training', 'Conference']

export default function Events() {
  // Load events from localStorage or fall back to dummy data
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('hospital_events')
    return saved ? JSON.parse(saved) : INITIAL_EVENTS
  })

  // State controls
  const [activeTab, setActiveTab] = useState('upcoming') // 'dashboard', 'upcoming', 'calendar', 'checkin'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)
  
  // Check-in Scanner State
  const [checkinEventId, setCheckinEventId] = useState('')
  const [checkinPatientName, setCheckinPatientName] = useState('')
  const [checkinMessage, setCheckinMessage] = useState(null)
  
  // Reminders Toggle State
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem('event_reminders_enabled') === 'true'
  })

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('hospital_events', JSON.stringify(events))
  }, [events])

  const handleReminderToggle = () => {
    const nextVal = !remindersEnabled
    setRemindersEnabled(nextVal)
    localStorage.setItem('event_reminders_enabled', String(nextVal))
  }

  // Statistics
  const totalEvents = events.length
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length
  const totalRegistrations = events.reduce((sum, e) => sum + e.registered, 0)
  const myRegistrations = events.filter(e => e.isRegistered).length

  // Chart Data preparation
  const chartData = CATEGORIES.slice(1).map(cat => {
    const catEvents = events.filter(e => e.category === cat)
    const registrations = catEvents.reduce((sum, e) => sum + e.registered, 0)
    return { name: cat, Registrations: registrations }
  })

  // Filtered Events
  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Create Event Form Handler
  const handleCreateEvent = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newEvent = {
      id: Date.now(),
      title: formData.get('title'),
      category: formData.get('category'),
      date: formData.get('date'),
      time: formData.get('time'),
      speaker: formData.get('speaker'),
      location: formData.get('location'),
      description: formData.get('description'),
      capacity: parseInt(formData.get('capacity') || '100'),
      registered: 0,
      isRegistered: false,
      attendees: []
    }
    setEvents([newEvent, ...events])
    setShowCreateModal(false)
  }

  // Edit Event Form Handler
  const handleEditEvent = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedEvents = events.map(evt => {
      if (evt.id === eventToEdit.id) {
        return {
          ...evt,
          title: formData.get('title'),
          category: formData.get('category'),
          date: formData.get('date'),
          time: formData.get('time'),
          speaker: formData.get('speaker'),
          location: formData.get('location'),
          description: formData.get('description'),
          capacity: parseInt(formData.get('capacity') || '100')
        }
      }
      return evt
    })
    setEvents(updatedEvents)
    setShowEditModal(false)
    setEventToEdit(null)
  }

  // Delete Event Handler
  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id))
      if (selectedEvent?.id === id) setSelectedEvent(null)
    }
  }

  // Register Toggle Handler
  const toggleRegistration = (eventId) => {
    setEvents(events.map(evt => {
      if (evt.id === eventId) {
        const alreadyReg = evt.isRegistered
        return {
          ...evt,
          isRegistered: !alreadyReg,
          registered: alreadyReg ? evt.registered - 1 : evt.registered + 1,
          attendees: alreadyReg 
            ? evt.attendees.filter(a => a !== 'Akin Yemi')
            : [...evt.attendees, 'Akin Yemi']
        }
      }
      return evt
    }))
  }

  // Checkin simulator submit
  const handleCheckinSubmit = (e) => {
    e.preventDefault()
    if (!checkinEventId || !checkinPatientName.trim()) {
      setCheckinMessage({ type: 'error', text: 'Please fill in all fields.' })
      return
    }

    const event = events.find(evt => evt.id === parseInt(checkinEventId))
    if (!event) {
      setCheckinMessage({ type: 'error', text: 'Event not found.' })
      return
    }

    // Check if patient registered
    const nameNorm = checkinPatientName.trim().toLowerCase()
    const isReg = event.attendees.some(att => att.toLowerCase() === nameNorm) || (nameNorm === 'akin yemi' && event.isRegistered)

    if (isReg) {
      setCheckinMessage({
        type: 'success',
        text: `Successfully Checked In: ${checkinPatientName} for "${event.title}". Welcome!`
      })
      // Add attendee if not in list
      const updatedEvents = events.map(evt => {
        if (evt.id === event.id) {
          const inList = evt.attendees.some(a => a.toLowerCase() === nameNorm)
          return {
            ...evt,
            attendees: inList ? evt.attendees : [...evt.attendees, checkinPatientName]
          }
        }
        return evt
      })
      setEvents(updatedEvents)
    } else {
      setCheckinMessage({
        type: 'warning',
        text: `${checkinPatientName} is not pre-registered for this event. Do you want to register them on the spot?`
      })
    }
  }

  // Export Events Handler
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Title,Category,Date,Time,Speaker,Location,Capacity,Registered']
        .concat(
          events.map(
            e =>
              `"${e.id}","${e.title.replace(/"/g, '""')}","${e.category}","${e.date}","${e.time}","${e.speaker.replace(/"/g, '""')}","${e.location.replace(/"/g, '""')}",${e.capacity},${e.registered}`
          )
        )
        .join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'hospital_events.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen w-full font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Events Management</h1>
          <p className="text-sm text-slate-500 mt-1">Schedule, register and manage upcoming conferences, seminars and trainings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#10AD69] hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* ── ALERTS / REMINDERS BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${remindersEnabled ? 'bg-emerald-50 text-[#10AD69]' : 'bg-slate-100 text-slate-400'}`}>
            <Bell size={18} className={remindersEnabled ? 'animate-bounce' : ''} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">Event Reminders & Updates</p>
            <p className="text-xs text-slate-400 mt-0.5">Toggle automated desktop notifications and calendar sync updates.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">{remindersEnabled ? 'Reminders Active' : 'Reminders Silenced'}</span>
          <button
            onClick={handleReminderToggle}
            className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none ${
              remindersEnabled ? 'bg-[#10AD69]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                remindersEnabled ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── OVERVIEW STATS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Events', val: totalEvents, desc: 'Registered in system', color: 'border-l-[#10AD69]' },
          { label: 'Upcoming', val: upcomingEvents, desc: 'Scheduled upcoming', color: 'border-l-blue-500' },
          { label: 'My Registrations', val: myRegistrations, desc: 'Events I am attending', color: 'border-l-purple-500' },
          { label: 'Total Sign-ups', val: totalRegistrations, desc: 'Cumulative participants', color: 'border-l-amber-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${stat.color} p-5 shadow-2xs`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 block">{stat.val}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 mb-6 flex gap-2 overflow-x-auto shadow-2xs no-scrollbar">
        {[
          { id: 'upcoming', label: 'Upcoming Events' },
          { id: 'calendar', label: 'Calendar View' },
          { id: 'dashboard', label: 'Registrations Graph' },
          { id: 'checkin', label: 'QR Attendance Check-in' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-100 text-slate-950 shadow-inner-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: UPCOMING EVENTS */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              
              {/* Search & Filtering Bars */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row gap-4 shadow-2xs">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search event title, speaker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm focus:outline-none focus:border-[#10AD69] focus:ring-1 focus:ring-[#10AD69]"
                  />
                </div>
                
                <div className="flex gap-2 items-center">
                  <Filter size={16} className="text-slate-400 shrink-0" />
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar max-w-[280px] sm:max-w-md">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#E2F5ED] text-[#10AD69]'
                            : 'bg-[#F8FAFC] text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-2xs">
                  <CalendarDays size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="font-bold text-slate-700 text-lg">No events found</h3>
                  <p className="text-sm text-slate-400 mt-1">Try tweaking your search term or category filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`bg-white rounded-2xl border p-5 transition-all duration-300 hover:shadow-md hover:border-slate-300 flex flex-col justify-between min-h-[240px] cursor-pointer ${
                        event.isRegistered ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            event.category === 'Webinar' ? 'bg-blue-50 text-blue-600' :
                            event.category === 'Seminar' ? 'bg-purple-50 text-purple-600' :
                            event.category === 'Training' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-[#10AD69]'
                          }`}>
                            {event.category}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{event.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mt-3 leading-snug tracking-tight hover:text-[#10AD69]">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <User size={13} className="shrink-0 text-slate-400" />
                          <span className="truncate font-semibold text-slate-700">{event.speaker}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 font-medium">
                          <span className="text-[#10AD69] font-bold">{event.registered}</span>
                          <span>/</span>
                          <span>{event.capacity} seats</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Event Schedule</h3>
                <span className="text-sm font-bold text-slate-500">July, 2026</span>
              </div>
              
              {/* Mock Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-400 mb-2 border-b border-slate-100 pb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Pad first week days */}
                {[1, 2].map(pad => <div key={`pad-${pad}`} className="min-h-[75px] bg-[#F8FAFC]/50 rounded-xl" />)}
                
                {/* Render days of July (1 to 31) */}
                {Array.from({ length: 31 }, (_, idx) => {
                  const dayNum = idx + 1
                  const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`
                  const dayEvents = events.filter(e => e.date === dateStr)
                  
                  return (
                    <div
                      key={dayNum}
                      className={`min-h-[75px] border p-2 rounded-xl flex flex-col justify-between transition-all relative ${
                        dayEvents.length > 0
                          ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-left font-bold text-xs text-slate-700">{dayNum}</span>
                      {dayEvents.map(evt => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className="bg-[#10AD69] text-white text-[9px] font-bold p-1 rounded-md mt-1 truncate cursor-pointer"
                          title={evt.title}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REGISTRATIONS GRAPH */}
          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Total Registrations by Category</h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={35}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} />
                    <Bar dataKey="Registrations" fill="#10AD69" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => {
                        const colors = ['#0EA5E9', '#6366F1', '#F59E0B', '#10AD69']
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 4: QR ATTENDANCE CHECK-IN */}
          {activeTab === 'checkin' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-4">QR Attendance Simulator</h3>
              <p className="text-xs text-slate-400 mb-6">Verify registration status and register attendance for hospital events immediately.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Mock Camera Viewfinder */}
                <div className="bg-slate-900 aspect-video rounded-2xl border border-slate-800 relative flex flex-col justify-center items-center p-4">
                  <div className="w-24 h-24 border-2 border-emerald-500 border-dashed rounded-lg flex items-center justify-center animate-pulse">
                    <QrCode size={40} className="text-emerald-500" />
                  </div>
                  <span className="text-[10px] text-slate-500 absolute bottom-3 uppercase font-extrabold tracking-widest">CAMERA FEED ACTIVATED</span>
                </div>

                {/* Simulation Form */}
                <form onSubmit={handleCheckinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Event</label>
                    <select
                      value={checkinEventId}
                      onChange={(e) => setCheckinEventId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                    >
                      <option value="">-- Choose Event --</option>
                      {events.map(evt => (
                        <option key={evt.id} value={evt.id}>{evt.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Patient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Akin Yemi"
                      value={checkinPatientName}
                      onChange={(e) => setCheckinPatientName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    Simulate QR Scan Check-In
                  </button>
                </form>
              </div>

              {/* Status Alert Notification */}
              {checkinMessage && (
                <div className={`mt-6 p-4 rounded-xl border flex gap-3 ${
                  checkinMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                  checkinMessage.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                  'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold">{checkinMessage.text}</p>
                    {checkinMessage.type === 'warning' && (
                      <button
                        type="button"
                        onClick={() => {
                          const evId = parseInt(checkinEventId)
                          const updated = events.map(evt => {
                            if (evt.id === evId) {
                              return {
                                ...evt,
                                registered: evt.registered + 1,
                                attendees: [...evt.attendees, checkinPatientName]
                              }
                            }
                            return evt
                          })
                          setEvents(updated)
                          setCheckinMessage({ type: 'success', text: `Registered and Checked In: ${checkinPatientName}` })
                        }}
                        className="mt-2 text-xs font-bold underline cursor-pointer"
                      >
                        Register Patient Now
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: EVENT DETAIL & ACTIONS PANEL (1/3 width on desktop) */}
        <div className="space-y-6">
          
          {/* Detailed View Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs min-h-[350px] flex flex-col justify-between">
            {selectedEvent ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#10AD69]">
                    {selectedEvent.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEventToEdit(selectedEvent)
                        setShowEditModal(true)
                      }}
                      className="p-1.5 bg-slate-50 text-slate-500 hover:text-[#10AD69] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="p-1.5 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug font-serif">{selectedEvent.title}</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Speaker: {selectedEvent.speaker}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {selectedEvent.description}
                </p>

                <div className="space-y-2 text-xs text-slate-600 border-t border-dashed border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{selectedEvent.location}</span>
                  </div>
                </div>

                {selectedEvent.isRegistered && (
                  <div className="bg-[#FFF5F5] rounded-2xl border border-rose-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#7A0C1E]">My Personal Pass</span>
                      <CheckCircle size={16} className="text-emerald-500" />
                    </div>
                    {/* Simulated Checkin Pass QR */}
                    <div className="bg-white border border-rose-100 p-2.5 rounded-xl w-fit mx-auto shadow-2xs">
                      <QrCode size={80} className="text-slate-800" />
                    </div>
                    <p className="text-[10px] text-center text-rose-800/80 font-medium">Show QR Code on device for reception scanner check-in.</p>
                  </div>
                )}

                <button
                  onClick={() => toggleRegistration(selectedEvent.id)}
                  className={`w-full font-bold text-sm py-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                    selectedEvent.isRegistered
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                      : 'bg-[#10AD69] hover:bg-emerald-600 text-white'
                  }`}
                >
                  {selectedEvent.isRegistered ? 'Cancel Registration' : 'Register for Event'}
                </button>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CalendarDays size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Select an Event</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Click any event card to view full details and registration options.</p>
              </div>
            )}
          </div>

          {/* Quick Notice Panel */}
          <div className="bg-slate-100 rounded-3xl p-6 relative overflow-hidden min-h-[160px] flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Hosting an Event?</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2 max-w-[85%]">
                Are you looking to organize clinical training or host a regional webinar? Contact hospital administrative support to schedule auditoriums.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('checkin')}
              className="bg-transparent hover:bg-slate-200 transition-colors text-slate-700 font-semibold text-[10px] px-3.5 py-1.5 rounded-lg border border-slate-300 self-start z-10 cursor-pointer mt-3"
            >
              Check-In Attendees
            </button>
          </div>

        </div>

      </div>

      {/* ── CREATE EVENT MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 mb-4 font-serif">Create New Event</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Hypertension Care Workshop"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Speaker</label>
                  <input
                    type="text"
                    name="speaker"
                    required
                    placeholder="e.g. Dr. Vance"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Time Range</label>
                  <input
                    type="text"
                    name="time"
                    required
                    placeholder="e.g. 14:00 - 15:30"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Location / Link</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Zoom Link or Auditorium B"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Max Seats Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue="100"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Summarize the core topics and learnings of this event..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT EVENT MODAL ── */}
      {showEditModal && eventToEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowEditModal(false)
                setEventToEdit(null)
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 mb-4 font-serif">Edit Event</h3>
            
            <form onSubmit={handleEditEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={eventToEdit.title}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={eventToEdit.category}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Speaker</label>
                  <input
                    type="text"
                    name="speaker"
                    required
                    defaultValue={eventToEdit.speaker}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={eventToEdit.date}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Time Range</label>
                  <input
                    type="text"
                    name="time"
                    required
                    defaultValue={eventToEdit.time}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Location / Link</label>
                <input
                  type="text"
                  name="location"
                  required
                  defaultValue={eventToEdit.location}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Max Seats Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue={eventToEdit.capacity}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={eventToEdit.description}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Styled custom scrollbars configuration */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  )
}
