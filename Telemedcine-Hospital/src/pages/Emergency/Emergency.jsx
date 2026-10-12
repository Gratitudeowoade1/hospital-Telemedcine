import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Diamond, Phone, Video, Navigation, Clock,
  FlaskConical, Brain, HeartCrack, Wind, Zap, Bandage,
  ArrowRight,
} from 'lucide-react'

// ── Typed data constants ──────────────────────────────────────────────────

const erWaitTimes = [
  { name: 'St. Jude Medical',    distance: '0.8 mi away', wait: '8m',  waitColor: 'text-[#10AD69]' },
  { name: 'Metro General Hosp.', distance: '2.4 mi away', wait: '15m', waitColor: 'text-yellow-500' },
  { name: 'Mercy Health Clinic', distance: '3.1 mi away', wait: '42m', waitColor: 'text-red-500'   },
]

const hotlines = [
  { name: 'Poison Control',       number: '1-800-222-1222', subtitle: '1-800-222-1222', Icon: FlaskConical },
  { name: 'Mental Health (988)',   subtitle: 'Suicide & Crisis Lifeline',               Icon: Brain        },
]

const ICON_MAP = { HeartCrack, Wind, Zap, Bandage }

const protocols = [
  {
    id: 1, title: 'Chest Pain',          icon: 'HeartCrack',
    iconBg: 'bg-red-100',   iconColor: 'text-red-500',    titleColor: 'text-red-600',    dotColor: 'bg-[#10AD69]',
    steps: ['Sit down and stay calm.', 'Chew one adult aspirin (325mg).', 'Do not drive yourself to hospital.'],
  },
  {
    id: 2, title: 'Difficulty Breathing', icon: 'Wind',
    iconBg: 'bg-green-100', iconColor: 'text-[#10AD69]',  titleColor: 'text-[#10AD69]', dotColor: 'bg-[#10AD69]',
    steps: ['Loosen tight clothing immediately.', 'Use rescue inhaler if prescribed.', 'Maintain upright seated position.'],
  },
  {
    id: 3, title: 'Severe Allergy',       icon: 'Zap',
    iconBg: 'bg-green-100', iconColor: 'text-[#10AD69]',  titleColor: 'text-[#10AD69]', dotColor: 'bg-[#10AD69]',
    steps: ['Use EpiPen (epinephrine) if available.', 'Call 911 immediately after use.', 'Lie flat with legs elevated.'],
  },
  {
    id: 4, title: 'Severe Injury',        icon: 'Bandage',
    iconBg: 'bg-red-100',   iconColor: 'text-red-500',    titleColor: 'text-red-600',   dotColor: 'bg-red-500',
    steps: ['Apply direct pressure to bleeding.', 'Do not move if neck/back injury.', 'Keep warm to prevent shock.'],
  },
]

// ── Component ─────────────────────────────────────────────────────────────

const Emergency = () => {
  const navigate = useNavigate()
  const [selectedProtocol, setSelectedProtocol] = useState(null)

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* ── SECTION 1 — TOP ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT: Immediate Assistance */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
          {/* Label */}
          <div className="flex items-center">
            <Diamond size={13} className="text-red-600 shrink-0" />
            <span className="ml-1.5 text-xs font-semibold text-red-600 uppercase tracking-widest">
              Critical Emergency Services
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
            Immediate Assistance Required?
          </h1>

          {/* Body */}
          <p className="mt-2 text-sm text-gray-500 max-w-md leading-relaxed">
            If you are experiencing a life-threatening emergency, call emergency services immediately.
            Our real-time response system is currently monitoring local facilities.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => { window.location.href = 'tel:911' }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors cursor-pointer"
            >
              <Phone size={17} /> Call 911 Now
            </button>
            <button
              onClick={() => navigate('/support')}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl px-6 py-3 transition-colors cursor-pointer"
            >
              <Video size={17} color="#10AD69" /> Tele-Triage Nurse
            </button>
          </div>

          {/* Decorative background squares */}
          <div className="absolute bottom-4 right-4 w-24 h-24 rounded-2xl border-2 border-gray-300 opacity-10 rotate-12 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-2xl border-2 border-gray-300 opacity-10 rotate-6 pointer-events-none" />
        </div>

        {/* RIGHT: Nearest ER */}
        <div className="lg:col-span-2 bg-[#10AD69] rounded-2xl p-5 text-white flex flex-col">
          {/* Header */}
          <div className="flex items-center">
            <Navigation size={17} className="text-white shrink-0" />
            <span className="ml-2 font-semibold text-white text-sm">Nearest Emergency Room</span>
          </div>

          {/* Inner white card */}
          <div className="bg-white rounded-xl p-4 mt-3 flex-1">
            <p className="text-[10px] uppercase text-gray-400 tracking-widest font-semibold">Closest Facility</p>
            <p className="font-bold text-gray-900 text-lg mt-1">St. Jude Medical Center</p>
            <p className="text-xs text-gray-500 mt-1">0.8 miles • 1200 Health Way, Metropolis</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="flex items-center gap-1 bg-gray-900 text-white text-xs rounded-full px-3 py-1">
                <Clock size={12} /> 8m wait
              </span>
              <span className="text-xs text-gray-500">Estimated arrival: 6 mins</span>
            </div>
          </div>

          {/* Navigation button */}
          <button
            onClick={() => window.open('https://www.google.com/maps/search/emergency+room+near+me', '_blank', 'noopener,noreferrer')}
            className="mt-4 flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold rounded-xl w-full py-3 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Navigation size={16} color="#10AD69" /> Start Navigation
          </button>
        </div>
      </div>

      {/* ── SECTION 2 — MIDDLE ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">

        {/* LEFT COLUMN — Wait Times + Hotlines */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Card A: ER Wait Times */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-900 text-base">Local ER Wait Times</span>
              <span className="bg-[#10AD69] text-white text-xs font-bold rounded-full px-2 py-0.5">LIVE</span>
            </div>
            {erWaitTimes.map((er, i) => (
              <div
                key={er.name}
                className={`flex items-center justify-between py-3 ${i < erWaitTimes.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{er.name}</p>
                  <p className="text-xs text-gray-400">{er.distance}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${er.waitColor}`}>{er.wait}</p>
                  <p className="text-xs text-gray-400">Wait Time</p>
                </div>
              </div>
            ))}
          </div>

          {/* Card B: Priority Hotlines */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-base mb-3">Priority Hotlines</h3>
            {hotlines.map((h) => (
              <div
                key={h.name}
                onClick={() => h.number
                  ? window.location.href = `tel:${h.number.replace(/-/g, '')}`
                  : window.location.href = 'tel:988'
                }
                className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 mb-2 last:mb-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <h.Icon size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{h.name}</p>
                  <p className="text-xs text-gray-400">{h.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — Emergency Protocols */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-gray-900 text-xl">Emergency Protocols</h2>
            <p className="text-xs text-gray-400 italic">Select a condition for immediate triage steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {protocols.map((p) => {
              const Icon = ICON_MAP[p.icon]
              const isSelected = selectedProtocol === p.id
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProtocol(isSelected ? null : p.id)}
                  className={`bg-white rounded-2xl shadow-sm p-4 relative cursor-pointer hover:shadow-md transition-shadow duration-200 ${
                    isSelected
                      ? (p.titleColor === 'text-red-600' ? 'ring-2 ring-red-500' : 'ring-2 ring-[#10AD69]')
                      : ''
                  }`}
                >
                  <ArrowRight
                    size={15}
                    className={`absolute top-4 right-4 transition-colors ${
                      isSelected
                        ? (p.titleColor === 'text-red-600' ? 'text-red-500' : 'text-[#10AD69]')
                        : 'text-gray-300'
                    }`}
                  />
                  <div className={`w-10 h-10 ${p.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                    {Icon && <Icon size={20} className={p.iconColor} />}
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${p.titleColor}`}>{p.title}</h3>
                  <ul>
                    {p.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                        <span className={`w-2 h-2 rounded-full ${p.dotColor} mt-1.5 shrink-0`} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 3 — BOTTOM BANNER ── */}
      <div className="mt-6 bg-green-50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-lg">
          <h2 className="font-bold text-gray-900 text-xl">Not a Life-Threatening Emergency?</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            If you need medical advice but are not in immediate danger, connect with an Urgent Care
            specialist via video in under 3 minutes.
          </p>
        </div>
        <button
          onClick={() => navigate('/support')}
          className="flex items-center gap-2 bg-[#10AD69] hover:bg-[#0d9457] text-white font-semibold rounded-xl px-6 py-3 whitespace-nowrap transition-colors cursor-pointer shrink-0"
        >
          <Video size={17} /> Start Tele-Triage Now
        </button>
      </div>

    </div>
  )
}

export default Emergency
