import { useState } from 'react'
import { User, Lock, Bell, Shield } from 'lucide-react'

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
    <div className="flex items-center gap-2 mb-5">
      <Icon size={18} color="#10AD69" />
      <h2 className="font-bold text-gray-800 text-base">{title}</h2>
    </div>
    {children}
  </div>
)

const Field = ({ label, type = 'text', defaultValue = '', placeholder = '' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#10AD69] focus:border-[#10AD69]"
    />
  </div>
)

const Toggle = ({ label, desc, defaultChecked }) => {
  const [on, setOn] = useState(defaultChecked ?? false)
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${on ? 'bg-[#10AD69]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

const Settings = () => (
  <div className="max-w-2xl mx-auto py-6">
    <h1 className="text-xl font-bold text-gray-800 mb-6">Settings</h1>

    <Section icon={User} title="Profile Information">
      <div className="flex items-center gap-4 mb-5">
        <img src="https://i.pravatar.cc/64" alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
        <button className="text-sm text-[#10AD69] border border-[#10AD69] px-4 py-1.5 rounded-lg hover:bg-[#f0fdf6] cursor-pointer transition-colors">
          Change Photo
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="First Name" defaultValue="Ade" />
        <Field label="Last Name" defaultValue="Josephine" />
      </div>
      <Field label="Email Address" type="email" defaultValue="ade.josephine@medicare.com" />
      <Field label="Role" defaultValue="Admin" />
      <button className="mt-2 px-6 py-2 bg-[#10AD69] text-white text-sm font-semibold rounded-lg hover:bg-[#0d9457] cursor-pointer transition-colors">
        Save Changes
      </button>
    </Section>

    <Section icon={Lock} title="Security">
      <Field label="Current Password" type="password" placeholder="••••••••" />
      <Field label="New Password" type="password" placeholder="••••••••" />
      <Field label="Confirm New Password" type="password" placeholder="••••••••" />
      <button className="mt-2 px-6 py-2 bg-[#10AD69] text-white text-sm font-semibold rounded-lg hover:bg-[#0d9457] cursor-pointer transition-colors">
        Update Password
      </button>
    </Section>

    <Section icon={Bell} title="Notification Preferences">
      <Toggle label="Email Notifications" desc="Receive updates via email" defaultChecked={true} />
      <Toggle label="Appointment Reminders" desc="Get reminded 1 hour before appointments" defaultChecked={true} />
      <Toggle label="Billing Alerts" desc="Notify on new invoices and payments" defaultChecked={false} />
      <Toggle label="System Announcements" desc="Maintenance and platform updates" defaultChecked={true} />
    </Section>

    <Section icon={Shield} title="Privacy">
      <Toggle label="Profile Visibility" desc="Allow staff to view your profile" defaultChecked={true} />
      <Toggle label="Activity Log" desc="Track your login and activity history" defaultChecked={false} />
    </Section>
  </div>
)

export default Settings
