import { useNavigate } from 'react-router-dom'
import { Mail, Shield, Calendar, Activity } from 'lucide-react'

const stats = [
  { label: 'Appointments', value: '124' },
  { label: 'Patients', value: '87' },
  { label: 'Reports', value: '36' },
  { label: 'Tasks Done', value: '210' },
]

const activity = [
  { action: 'Logged in', time: '2 mins ago' },
  { action: 'Reviewed EHR for patient #1042', time: '20 mins ago' },
  { action: 'Approved invoice #2041', time: '1 hr ago' },
  { action: 'Updated appointment schedule', time: '3 hrs ago' },
  { action: 'Added new patient: Sarah M.', time: 'Yesterday' },
]

const Profile = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-4">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
        <img
          src="https://i.pravatar.cc/80"
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-800">Ade Josephine</h1>
          <span className="inline-block text-xs uppercase font-semibold text-[#10AD69] bg-[#f0fdf6] px-2 py-0.5 rounded-full mt-1">Admin</span>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Mail size={14} /> ade.josephine@medicare.com</span>
            <span className="flex items-center gap-1.5"><Shield size={14} /> Full Access</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined Jan 2023</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="shrink-0 px-4 py-2 border border-[#10AD69] text-[#10AD69] text-sm font-semibold rounded-lg hover:bg-[#f0fdf6] cursor-pointer transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-[#10AD69]">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} color="#10AD69" />
          <h2 className="font-bold text-gray-800">Recent Activity</h2>
        </div>
        <ul className="space-y-0">
          {activity.map(({ action, time }, i) => (
            <li key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-sm text-gray-700">{action}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Profile
