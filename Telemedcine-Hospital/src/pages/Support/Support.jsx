import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Filter,
  Plus,
  Send,
  Megaphone,
  X,
  UserCheck,
  CheckCircle,
  FileText,
  Star
} from 'lucide-react'
import api from '../../services/api'

// Initial dummy tickets data
const INITIAL_TICKETS = [
  {
    id: 'TCK-1001',
    subject: 'Unable to access laboratory PDF report',
    category: 'Technical',
    priority: 'High',
    status: 'Open',
    assignedTo: 'IT Support Desk',
    date: '2026-06-28',
    description: 'When clicking the download button in EHR for my lab test, I receive a blank page with a 404 error code.'
  },
  {
    id: 'TCK-1002',
    subject: 'Incorrect invoice charge on consultation',
    category: 'Billing',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Finance Dept',
    date: '2026-06-29',
    description: 'My invoice INV-1001 details show an incorrect calculation for standard consultation fees. I was billed twice.'
  },
  {
    id: 'TCK-1003',
    subject: 'Prescription dosage clarification request',
    category: 'Clinical',
    priority: 'Critical',
    status: 'Resolved',
    assignedTo: 'Dr. Helen Vance',
    date: '2026-06-25',
    description: 'Requesting confirmation on whether I should take the Metformin twice daily with food or before sleep.'
  },
  {
    id: 'TCK-1004',
    subject: 'General telemedicine portal speed lags',
    category: 'General',
    priority: 'Low',
    status: 'Closed',
    assignedTo: 'None',
    date: '2026-06-20',
    description: 'Just offering feedback that the dashboard charts sometimes require up to 5 seconds to load on home broadband.'
  }
]

const ANNOUNCEMENTS = [
  { id: 1, title: 'Portal Maintenance Notice', date: '2026-06-29', text: 'The patient portal will undergo scheduled database optimizations on Sunday, July 5th from 01:00 AM to 03:00 AM. Expect temporary service interruptions.', type: 'Warning' },
  { id: 2, title: 'New Telehealth Specialist Board', date: '2026-06-26', text: 'We have added three board-certified neurologists to the digital panel. You can now schedule video consults directly from EHR cards.', type: 'Info' }
]

const FAQS = [
  { q: 'How do I download my EHR medical records?', a: 'Navigate to the EHR tab, open the details of your lab test or consult, and click the "Print Receipt" or "My Records" button to export or print files.', category: 'EHR' },
  { q: 'What payment methods do you support online?', a: 'Medicare accepts online credit/debit card checkouts, bank transfers, and automated claims clearance routing through certified HMO networks.', category: 'Billing' },
  { q: 'How does the AI Diagnosis portal work?', a: 'The AI diagnostics assistant analyzes uploaded patient symptoms and clinical scans, and suggests probable diagnoses alongside risk and confidence metrics for practitioner verification.', category: 'Clinical' },
  { q: 'Who do I contact in case of an emergency?', a: 'Click the "Emergency Alert" button located at the bottom of the sidebar. It triggers immediate emergency protocols and broadcasts alert alerts to responders.', category: 'General' }
]

const AGENTS = ['IT Support Desk', 'Finance Dept', 'Dr. Helen Vance', 'Dr. Sarah Myers', 'Unassigned']

export default function Support() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('hospital_tickets')
    return saved ? JSON.parse(saved) : INITIAL_TICKETS
  })

  // State controls
  const [activeTab, setActiveTab] = useState('tickets') // 'tickets', 'knowledge', 'announcements', 'feedback'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('All')
  
  // Modal controllers
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  // Live Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! Welcome to MediCare Support. How can we assist you today?', sender: 'bot', time: '10:00' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  // Fetch real tickets from backend API
  useEffect(() => {
    let isMounted = true

    async function loadTickets() {
      try {
        const res = await api.getSupportTickets().catch(() => null)
        if (isMounted && res?.success && res.data?.length) {
          const mapped = res.data.map(t => ({
            id: `TCK-${t.id}`,
            apiId: t.id,
            subject: t.title,
            category: t.category || 'General',
            priority: t.priority || 'Medium',
            status: t.status === 'UNREAD' ? 'Open' : (t.status || 'Open'),
            assignedTo: 'IT Support Desk',
            date: t.created_at || '2026-10-12',
            description: t.message,
            authorName: t.author_name || 'Patient'
          }))
          setTickets(mapped)
        }
      } catch (err) {
        console.warn('Support tickets fetch note:', err.message)
      }
    }

    loadTickets()
    return () => { isMounted = false }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hospital_tickets', JSON.stringify(tickets))
  }, [tickets])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isBotTyping])

  // Stats calculation
  const totalTickets = tickets.length
  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length
  const myAssignedCount = tickets.filter(t => t.assignedTo === 'Dr. Helen Vance').length

  // Filter tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority
    return matchesSearch && matchesPriority
  })

  // Create Ticket Form Submit
  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const title = formData.get('subject')
    const message = formData.get('description')
    const category = formData.get('category')
    const priority = formData.get('priority')

    let serverTicketId = `TCK-${Date.now().toString().slice(-4)}`
    try {
      const res = await api.createSupportTicket({
        title,
        message,
        category,
        priority
      })
      if (res?.ticketId) {
        serverTicketId = `TCK-${res.ticketId}`
      }
    } catch (err) {
      console.warn('Backend create ticket note:', err.message)
    }

    const newTicket = {
      id: serverTicketId,
      subject: title,
      category,
      priority,
      status: 'Open',
      assignedTo: 'Unassigned',
      date: new Date().toISOString().split('T')[0],
      description: message
    }

    setTickets([newTicket, ...tickets])
    setShowCreateModal(false)
  }

  // Assign Ticket Submit
  const handleAssignSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const assignee = formData.get('assignedTo')

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, assignedTo: assignee }
      }
      return t
    })
    setTickets(updated)
    setSelectedTicket({ ...selectedTicket, assignedTo: assignee })
    setShowAssignModal(false)
  }

  // Status Change Submit
  const handleStatusSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nextStatus = formData.get('status')

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, status: nextStatus }
      }
      return t
    })
    setTickets(updated)
    setSelectedTicket({ ...selectedTicket, status: nextStatus })
    setShowStatusModal(false)
  }

  // Live Chat Send Message Simulator
  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      time: timeStr
    }
    
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsBotTyping(true)

    // Trigger Bot auto response after 1.5 seconds
    setTimeout(() => {
      let botResponse = 'Thank you for your message. An administrative support representative has been alerted to review this ticket request.'
      const userTextLower = userMsg.text.toLowerCase()
      
      if (userTextLower.includes('billing') || userTextLower.includes('payment') || userTextLower.includes('invoice')) {
        botResponse = 'For billing complaints, please make sure you mention the specific Invoice ID (e.g. INV-1001). Our finance agents typically respond within 2 hours.'
      } else if (userTextLower.includes('ehr') || userTextLower.includes('report') || userTextLower.includes('pdf')) {
        botResponse = 'Lab reports and EHR files are synced immediately. If a download fails, clearing your browser cache or trying a different browser usually resolves this technical issue.'
      } else if (userTextLower.includes('hello') || userTextLower.includes('hi')) {
        botResponse = 'Hello! I am the Medicare Support assistant. You can ask me questions about billing, EHR access, or AI diagnosis tools.'
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        time: timeStr
      }])
      setIsBotTyping(false)
    }, 1500)
  }

  // Feedback Form Submit
  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    setFeedbackSuccess(true)
    setTimeout(() => {
      setFeedbackComment('')
      setFeedbackSuccess(false)
    }, 2500)
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen w-full font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Help & Support Center</h1>
          <p className="text-sm text-slate-500 mt-1">Submit technical tickets, review knowledge base FAQs, view notices, and chat with help desks.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#10AD69] hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Submit Ticket</span>
        </button>
      </div>

      {/* ── SUPPORT STATISTICS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tickets', val: totalTickets, desc: 'Logged requests', color: 'border-l-blue-500' },
          { label: 'Active / Open', val: openTickets, desc: 'Needs support reply', color: 'border-l-rose-500' },
          { label: 'Resolved / Closed', val: resolvedTickets, desc: 'Archived records', color: 'border-l-emerald-500' },
          { label: 'Assigned to Me', val: myAssignedCount, desc: 'Clinical consultations', color: 'border-l-purple-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${stat.color} p-5 shadow-2xs`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 block">{stat.val}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* ── SUB LEVEL TABS NAVIGATION ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 mb-6 flex gap-2 overflow-x-auto shadow-2xs no-scrollbar">
        {[
          { id: 'tickets', label: 'Ticket Center Ledger' },
          { id: 'knowledge', label: 'Knowledge Base & FAQs' },
          { id: 'announcements', label: 'Notices Board' },
          { id: 'feedback', label: 'Service Feedback Form' }
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

      {/* ── MAIN CONTENT GRID LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: TICKET CENTER */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              
              {/* Search & filters bar */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row gap-4 shadow-2xs">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ticket subject, ticket ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
                
                <div className="flex gap-2 items-center">
                  <Filter size={16} className="text-slate-400 shrink-0" />
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar max-w-[280px]">
                    {['All', 'Low', 'Medium', 'High', 'Critical'].map(pri => (
                      <button
                        key={pri}
                        onClick={() => setSelectedPriority(pri)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedPriority === pri
                            ? 'bg-[#E2F5ED] text-[#10AD69]'
                            : 'bg-[#F8FAFC] text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {pri}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tickets Table */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                        <th className="px-5 py-4">Ticket ID</th>
                        <th className="px-5 py-4">Subject</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4 text-center">Priority</th>
                        <th className="px-5 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-5 py-12 text-center text-slate-400 text-xs">
                            No tickets log recorded or found.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map(t => (
                          <tr
                            key={t.id}
                            onClick={() => setSelectedTicket(t)}
                            className={`hover:bg-slate-50/60 cursor-pointer transition-colors ${
                              selectedTicket?.id === t.id ? 'bg-[#E2F5ED]/20' : ''
                            }`}
                          >
                            <td className="px-5 py-4 text-xs font-bold text-slate-900">{t.id}</td>
                            <td className="px-5 py-4 font-semibold text-slate-800">
                              <div>
                                <p>{t.subject}</p>
                                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{t.date} • Assigned to: {t.assignedTo}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-500 font-medium">{t.category}</td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                t.priority === 'Critical' ? 'bg-red-50 text-red-700' :
                                t.priority === 'High' ? 'bg-orange-50 text-orange-700' :
                                t.priority === 'Medium' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-50 text-slate-700'
                              }`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                t.status === 'Open' ? 'bg-blue-50 text-blue-800 animate-pulse' :
                                t.status === 'In Progress' ? 'bg-amber-50 text-amber-800' :
                                t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KNOWLEDGE BASE & FAQS */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
                <h3 className="font-bold text-slate-800 text-lg mb-2 font-serif">Self-Help Support Documents</h3>
                <p className="text-xs text-slate-400 mb-6 font-medium">Quick search for resolutions to common telemedicine queries.</p>

                <div className="space-y-4">
                  {FAQS.map((faq, i) => (
                    <details key={i} className="group border border-slate-100 rounded-2xl p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer">
                      <summary className="list-none flex justify-between items-center text-xs font-bold text-slate-800 select-none">
                        <span>{faq.q}</span>
                        <span className="text-[#10AD69] font-bold text-sm transition-transform duration-200 group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-xs text-slate-500 leading-relaxed font-medium pl-1 border-t border-slate-200/50 pt-2.5">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS BOARD */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {ANNOUNCEMENTS.map(ann => (
                <div key={ann.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs relative flex gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-full h-fit shrink-0">
                    <Megaphone size={18} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{ann.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{ann.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SERVICE FEEDBACK FORM */}
          {activeTab === 'feedback' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-2 font-serif">Hospital Experience Feedback</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">Help Medicare staff audit and polish digital consulting and clinical care services.</p>

              {feedbackSuccess ? (
                <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-2">
                  <CheckCircle size={36} className="text-emerald-500 animate-bounce" />
                  <h4 className="font-bold text-emerald-800 text-sm">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-emerald-700 max-w-[280px]">Your feedback ratings and details have been logged for clinic audit reviews.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Overall Service Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star size={24} fill={feedbackRating >= star ? '#FBBF24' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Detailed Remarks</label>
                    <textarea
                      rows="4"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Comment on doctor responsiveness, EHR dashboard usage, or billing payment clarity..."
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    Send Feedback Report
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DETAIL PANEL & LIVE CHAT (1/3 width) */}
        <div className="space-y-6">
          
          {/* Ticket Inspector Detail Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
            {selectedTicket ? (
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{selectedTicket.id}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">{selectedTicket.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    selectedTicket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800' :
                    selectedTicket.status === 'In Progress' ? 'bg-amber-50 text-amber-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Body details */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Subject</span>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">{selectedTicket.subject}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">Category: {selectedTicket.category}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium border-t border-slate-100 pt-3">
                  {selectedTicket.description}
                </p>

                {/* Metadata */}
                <div className="bg-[#F8FAFC] border border-slate-100 p-3 rounded-2xl text-[11px] font-semibold space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Priority Level:</span>
                    <span className="text-rose-600 font-bold">{selectedTicket.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Owner:</span>
                    <span className="text-slate-800">{selectedTicket.assignedTo}</span>
                  </div>
                </div>

                {/* Operations */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-100">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex justify-center items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-xl text-xs cursor-pointer shadow-2xs"
                  >
                    <UserCheck size={12} />
                    <span>Assign Agent</span>
                  </button>
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="flex justify-center items-center gap-1 bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    <span>Update Status</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <FileText size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Select a Ticket</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Click any record in the ticket center table to audit status, assign IT, or resolve issues.</p>
              </div>
            )}
          </div>

          {/* ── LIVE CHAT BOX WIDGET ── */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-2xs min-h-[350px] flex flex-col justify-between">
            <div className="bg-slate-900 p-4 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                💬
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Live Support Chat</h4>
                <span className="text-[9px] text-[#10AD69] font-bold tracking-wider uppercase block">ONLINE ASSISTANT</span>
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[200px] bg-[#F8FAFC]">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                    msg.sender === 'user' ? 'bg-[#10AD69] text-white rounded-tr-none' : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-3xs'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400 font-medium mt-1">{msg.time}</span>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex gap-1.5 p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-none w-fit shadow-3xs text-[10px] text-slate-400 font-bold animate-pulse">
                  Agent typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChatMessage} className="border-t border-slate-100 p-2.5 flex gap-2 bg-white">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about bills, EHR files..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
              />
              <button
                type="submit"
                className="bg-[#10AD69] hover:bg-emerald-600 text-white p-2 rounded-xl cursor-pointer transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* ── SUBMIT TICKET MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 mb-4 font-serif">Log Support Ticket</h3>
            
            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Issue Subject Title</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="e.g. Cannot view lab test result attachment"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Clinical">Clinical</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Urgency Priority</label>
                  <select
                    name="priority"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Explain details of your complaint</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Explain exactly what happened, including any error codes or transaction IDs."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ASSIGN TICKET MODAL ── */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-base text-slate-800 mb-4 font-serif">Assign Ticket Owner</h3>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Assign to Agent Desk / Staff Specialist</label>
                <select
                  name="assignedTo"
                  defaultValue={selectedTicket.assignedTo}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                >
                  {AGENTS.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Save Assignee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── UPDATE STATUS MODAL ── */}
      {showStatusModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-base text-slate-800 mb-4 font-serif">Update Ticket Status</h3>
            
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Select Status</label>
                <select
                  name="status"
                  defaultValue={selectedTicket.status}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Save Status
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
