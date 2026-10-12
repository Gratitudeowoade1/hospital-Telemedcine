import { CheckCircle, Bell } from 'lucide-react'

const ALL_NOTIFICATIONS = [
  { id: 1, title: 'New appointment booked', desc: 'Patient John D. scheduled for 3pm today', time: '2 mins ago', icon: CheckCircle, color: '#10AD69', bg: '#f0fdf6' },
  { id: 2, title: 'Lab results ready', desc: 'EHR updated for patient #1042 — review required', time: '15 mins ago', icon: CheckCircle, color: '#10AD69', bg: '#f0fdf6' },
  { id: 3, title: 'Billing invoice generated', desc: 'Invoice #2041 is ready for review and approval', time: '1 hr ago', icon: Bell, color: '#F59E0B', bg: '#fffbeb' },
  { id: 4, title: 'System maintenance scheduled', desc: 'Scheduled downtime this Sunday 2–4am', time: '3 hrs ago', icon: Bell, color: '#EF4444', bg: '#fff1f1' },
  { id: 5, title: 'New patient registered', desc: 'Welcome Sarah M. to the MediCare portal', time: '5 hrs ago', icon: CheckCircle, color: '#10AD69', bg: '#f0fdf6' },
  { id: 6, title: 'Support ticket resolved', desc: 'Ticket #882 has been closed successfully', time: 'Yesterday', icon: CheckCircle, color: '#10AD69', bg: '#f0fdf6' },
  { id: 7, title: 'Appointment rescheduled', desc: 'Dr. Ade moved patient #1099 to Monday 10am', time: 'Yesterday', icon: Bell, color: '#F59E0B', bg: '#fffbeb' },
  { id: 8, title: 'New message from patient', desc: 'Jane O. sent a follow-up query about prescription', time: '2 days ago', icon: Bell, color: '#6B7280', bg: '#f9fafb' },
]

const Notifications = () => (
  <div className="max-w-2xl mx-auto py-6">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-gray-800">All Notifications</h1>
      <button className="text-sm text-[#10AD69] hover:underline cursor-pointer">Mark all as read</button>
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {ALL_NOTIFICATIONS.map(({ id, title, desc, time, icon: Icon, color, bg }) => (
        <div
          key={id}
          className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
            <Icon size={18} color={color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{time}</span>
        </div>
      ))}
    </div>
  </div>
)

export default Notifications
