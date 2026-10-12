import { useState, useEffect } from "react";
import {
  Search,
  Mic,
  ChevronLeft,
  ChevronRight,
  Heart,
  Stethoscope,
  Activity,
  FlaskConical,
  FileText,
  MessageSquareText,
  Microscope,
  Pill,
} from "lucide-react";
import api from "../../services/api";

// Data Constants
const TABS = ["All", "Tests", "Advice", "Labs", "Docs"];
const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri"];

const PATIENTS = [
  {
    id: 1,
    tab: "Tests",
    name: "Yinusa Grace",
    role: "Admin",
    avatar: "YG",
    avatarColor: "bg-emerald-500",
    type: "Test",
    label: "Echocardiogram",
    date: "5 Feb",
    icon: Heart,
    iconBg: "bg-emerald-50",
  },
  {
    id: 2,
    tab: "Tests",
    name: "DR. Yinusa Grace",
    role: "Cardiologist",
    avatar: "DY",
    avatarColor: "bg-blue-500",
    type: "Blood Group",
    label: "Test",
    date: "6 Feb",
    icon: Stethoscope,
    iconBg: "bg-emerald-50",
    highlight: true,
  },
  {
    id: 3,
    tab: "Tests",
    name: "DR. Yinusa Grace",
    role: "Cardiologist",
    avatar: "DY",
    avatarColor: "bg-purple-500",
    type: "X-Ray",
    label: "Test",
    date: "7 Feb",
    icon: Activity,
    iconBg: "bg-emerald-50",
  },
  {
    id: 4,
    tab: "Advice",
    name: "DR. Amara Nwosu",
    role: "General Physician",
    avatar: "AN",
    avatarColor: "bg-amber-500",
    type: "Advice",
    label: "Rest & Hydration",
    date: "8 Feb",
    icon: MessageSquareText,
    iconBg: "bg-amber-50",
  },
  {
    id: 5,
    tab: "Advice",
    name: "DR. Kolade Bello",
    role: "Nutritionist",
    avatar: "KB",
    avatarColor: "bg-orange-500",
    type: "Advice",
    label: "Diet Plan",
    date: "9 Feb",
    icon: Pill,
    iconBg: "bg-orange-50",
    highlight: true,
  },
  {
    id: 6,
    tab: "Labs",
    name: "Central Lab",
    role: "Laboratory",
    avatar: "CL",
    avatarColor: "bg-cyan-500",
    type: "Lab",
    label: "Full Blood Count",
    date: "10 Feb",
    icon: FlaskConical,
    iconBg: "bg-cyan-50",
  },
  {
    id: 7,
    tab: "Labs",
    name: "BioPath Services",
    role: "Pathologist",
    avatar: "BP",
    avatarColor: "bg-teal-500",
    type: "Lab",
    label: "Urinalysis",
    date: "11 Feb",
    icon: Microscope,
    iconBg: "bg-teal-50",
    highlight: true,
  },
  {
    id: 8,
    tab: "Docs",
    name: "Records Unit",
    role: "Administration",
    avatar: "RU",
    avatarColor: "bg-indigo-500",
    type: "Document",
    label: "Discharge Summary",
    date: "12 Feb",
    icon: FileText,
    iconBg: "bg-indigo-50",
  },
  {
    id: 9,
    tab: "Docs",
    name: "DR. Fatima Sule",
    role: "Consultant",
    avatar: "FS",
    avatarColor: "bg-rose-500",
    type: "Document",
    label: "Referral Letter",
    date: "13 Feb",
    icon: FileText,
    iconBg: "bg-rose-50",
    highlight: true,
  },
];

const CALENDAR = [
  {
    day: "Mon",
    date: 2,
    time: "3:32 pm",
    events: ["3 Tests"],
    color: "bg-[#D9D9D9] border-transparent text-gray-800",
    dotColor: "bg-[#8CA296]",
  },
  {
    day: "Tue",
    date: 3,
    time: "4:32 pm",
    events: ["Vitamin C"],
    color: "bg-white border-gray-100/80 shadow-xs",
    icon: "🍊",
    dotColor: "bg-amber-400",
    hasStatusAvatars: true,
  },
  {
    day: "Wed",
    date: 4,
    time: "5:02 pm",
    events: ["Omega 3"],
    color: "bg-white border-gray-100/80 shadow-xs",
    icon: "🌟",
    dotColor: "bg-yellow-400",
    hasStatusAvatars: true,
  },
  {
    day: "Thur",
    date: 5,
    time: "2:22 pm",
    events: ["1 Advice"],
    color: "bg-[#107C41] border-transparent text-white shadow-sm",
    dotColor: "bg-[#094F29]",
    active: true,
  },
  {
    day: "Fri",
    date: 6,
    time: "1:00 pm",
    events: ["Aflubin"],
    color: "bg-white border-gray-100/80 shadow-xs",
    icon: "🧱",
    dotColor: "bg-amber-500",
    hasStatusAvatars: true,
  },
];

// Sub-Component: Individual Patient/Test Card
function PatientCard({ patient }) {
  const IconComponent = patient.icon;

  return (
    <div
      className={`group rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] transition-all duration-300 border cursor-default ${
        patient.highlight
          ? "bg-[#107C41] text-white shadow-lg shadow-green-100/60 border-transparent hover:shadow-xl hover:shadow-green-200/50"
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md shadow-sm"
      }`}
    >
      {/* Top: Avatar + Name + Status dot */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm ${patient.avatarColor}`}
          >
            {patient.avatar}
          </div>
          <div className="min-w-0">
            <p
              className={`text-xs font-bold tracking-wide truncate ${
                patient.highlight ? "text-white" : "text-gray-900"
              }`}
            >
              {patient.name}
            </p>
            <p
              className={`text-[11px] mt-0.5 font-medium ${
                patient.highlight ? "text-green-100/80" : "text-gray-400"
              }`}
            >
              {patient.role}
            </p>
          </div>
        </div>
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            patient.highlight ? "bg-green-200" : "bg-emerald-400"
          }`}
        />
      </div>

      {/* Middle: Type + Label + Date */}
      <div className="mt-4 space-y-0.5">
        <p
          className={`text-[10px] font-bold tracking-widest uppercase ${
            patient.highlight ? "text-green-200/80" : "text-gray-400"
          }`}
        >
          {patient.type}
        </p>
        <h3
          className={`text-base font-bold leading-snug ${
            patient.highlight ? "text-white" : "text-gray-900"
          }`}
        >
          {patient.label}
        </h3>
        <p
          className={`text-[11px] font-medium pt-0.5 ${
            patient.highlight ? "text-green-100/70" : "text-gray-400"
          }`}
        >
          {patient.date}
        </p>
      </div>

      {/* Bottom: Icon badge */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mt-4 border transition-transform duration-200 ${
          patient.highlight
            ? "bg-white/15 text-white border-white/20"
            : `${patient.iconBg} text-[#107C41] border-transparent group-hover:scale-105`
        }`}
      >
        <IconComponent size={20} strokeWidth={2.2} />
      </div>
    </div>
  );
}

// Sub-Component: Empty state when no records match the active tab
function EmptyState({ tab }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <FileText size={24} className="text-gray-400" />
      </div>
      <p className="text-sm font-bold text-gray-700">No {tab} records found</p>
      <p className="text-xs text-gray-400 mt-1 max-w-[200px] leading-relaxed">
        Records added under{" "}
        <span className="font-semibold text-gray-500">{tab}</span> will appear
        here.
      </p>
    </div>
  );
}

// Sub-Component: Bottom Calendar Section
function CalendarSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm active:scale-95">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="text-xl font-bold font-serif text-gray-900 px-1">
          May, <span className="text-gray-400 font-normal">2024</span>
        </span>
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm active:scale-95">
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Day headers — only shown when 5-col grid is active */}
      <div className="hidden lg:grid grid-cols-5 gap-3 mb-1">
        {DAYS.map((d) => (
          <p
            key={d}
            className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-left pl-1"
          >
            {d}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CALENDAR.map((c) => (
          <div
            key={c.date}
            className={`border rounded-[20px] p-3 sm:p-4 flex flex-col justify-between min-h-[110px] sm:min-h-[125px] transition-all duration-200 ${c.color}`}
          >
            <div className="flex justify-between items-start w-full">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">
                {c.date}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-medium tracking-tight ${
                  c.active ? "text-green-100/90" : "text-gray-400"
                }`}
              >
                {c.time}
              </span>
            </div>

            {/* Day label shown on mobile/tablet since headers are hidden */}
            <span className="lg:hidden text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
              {c.day}
            </span>

            <div className="mt-auto flex items-center justify-between w-full gap-1">
              {c.events.map((ev) => (
                <div key={ev} className="flex items-center gap-1.5 min-w-0">
                  {c.icon ? (
                    <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-[10px] border border-gray-100 shadow-2xs flex-shrink-0">
                      {c.icon}
                    </div>
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dotColor}`}
                    />
                  )}
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold tracking-wide truncate ${
                      c.active ? "text-[#083A1F]" : "text-gray-800"
                    }`}
                  >
                    {ev}
                  </span>
                </div>
              ))}

              {c.hasStatusAvatars && (
                <div className="flex -space-x-1.5 overflow-hidden flex-shrink-0 items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FFE8D1] text-[#E67E22] text-[8px] font-black border border-white flex items-center justify-center shadow-2xs select-none">
                    !
                  </div>
                  <div className="w-4 h-4 rounded-full bg-black text-amber-400 text-[8px] border border-white flex items-center justify-center shadow-2xs select-none">
                    🌙
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-Component: Side Content Action Bar
function RightPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[200px]">
        <div className="text-center space-y-2 max-w-[220px] mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">
            What do you need?
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            What do you lorem ipsum du duid u lorem ipsum du duid ud rimch
            capmu eclabusha sht toak mangu need?
          </p>
        </div>

        <div className="flex justify-center my-4">
          <button className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-md shadow-green-100 hover:bg-green-600 transition-all active:scale-95">
            <Mic size={20} className="text-white" />
          </button>
        </div>

        <div className="relative flex items-center bg-[#F8F9FA] border border-gray-200/80 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mr-2">
            <span className="text-green-600 text-xs">🔊</span>
          </div>
          <input
            type="text"
            placeholder="Angstrom and structure..."
            className="bg-transparent text-xs text-gray-800 font-semibold placeholder-gray-400 outline-none flex-1 min-w-0"
            readOnly
          />
          <button className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 ml-1">
            <Search size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
        <div className="relative z-10 space-y-5 pb-2">
          <div>
            <span className="text-4xl font-black text-gray-900 block leading-none font-serif">
              B
            </span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1 block">
              Structure
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900 block leading-none">
              22.4
            </span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1 block">
              Angstrom
            </span>
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {["❤️", "📋", "✕"].map((icon, i) => (
            <button
              key={i}
              className="w-8 h-8 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-center text-xs hover:bg-gray-100 shadow-sm backdrop-blur-xs transition-colors active:scale-95"
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="absolute right-12 bottom-0 top-0 w-1/2 flex items-center justify-end pointer-events-none select-none">
          <svg
            viewBox="0 0 100 160"
            className="w-full h-full stroke-[5] fill-none stroke-linecap-round"
          >
            <path
              d="M20,10 Q80,45 20,80 T20,150"
              className="stroke-blue-500 drop-shadow-[0_2px_8px_rgba(59,130,246,0.25)]"
            />
            <path
              d="M80,10 Q20,45 80,80 T80,150"
              className="stroke-indigo-600 opacity-90 drop-shadow-[0_2px_8px_rgba(79,70,229,0.2)]"
            />
            <line
              x1="28" y1="23" x2="72" y2="18"
              className="stroke-blue-200 opacity-60 stroke-[2.5]"
            />
            <line
              x1="42" y1="50" x2="58" y2="50"
              className="stroke-blue-200 opacity-60 stroke-[2.5]"
            />
            <line
              x1="45" y1="75" x2="55" y2="75"
              className="stroke-indigo-200 opacity-60 stroke-[2.5]"
            />
            <line
              x1="28" y1="105" x2="72" y2="110"
              className="stroke-indigo-200 opacity-60 stroke-[2.5]"
            />
            <line
              x1="42" y1="135" x2="58" y2="135"
              className="stroke-blue-200 opacity-60 stroke-[2.5]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Master Component Wrapper
export default function EHRContent() {
  const [activeTab, setActiveTab] = useState("Tests");
  const [records, setRecords] = useState(PATIENTS);

  useEffect(() => {
    let isMounted = true;

    async function loadEHR() {
      try {
        const [ehrRes, labRes] = await Promise.all([
          api.getEHRRecords().catch(() => null),
          api.getLabTests().catch(() => null),
        ]);

        const newItems = [];

        if (labRes?.success && labRes.data?.length) {
          labRes.data.forEach((l, idx) => {
            newItems.push({
              id: 100 + idx,
              tab: "Labs",
              name: l.patient_name || "Patient",
              role: l.category || "Pathology Lab",
              avatar: (l.patient_name || "P").substring(0, 2).toUpperCase(),
              avatarColor: "bg-cyan-500",
              type: "Lab",
              label: l.test_name,
              date: l.test_date || "Recent",
              icon: FlaskConical,
              iconBg: "bg-cyan-50",
            });
          });
        }

        if (ehrRes?.success && ehrRes.data?.length) {
          ehrRes.data.forEach((r, idx) => {
            newItems.push({
              id: 200 + idx,
              tab: "Advice",
              name: r.doctor_name || "Dr. Richardson",
              role: "Doctor",
              avatar: (r.doctor_name || "DR").substring(0, 2).toUpperCase(),
              avatarColor: "bg-emerald-500",
              type: "Advice",
              label: r.diagnosis || "Health Advice",
              date: r.record_date || "Recent",
              icon: MessageSquareText,
              iconBg: "bg-emerald-50",
            });
            newItems.push({
              id: 300 + idx,
              tab: "Docs",
              name: r.patient_name || "Patient Record",
              role: "Prescription",
              avatar: "RX",
              avatarColor: "bg-orange-500",
              type: "Document",
              label: r.prescription || "Medical Treatment",
              date: r.record_date || "Recent",
              icon: FileText,
              iconBg: "bg-orange-50",
            });
          });
        }

        if (isMounted && newItems.length > 0) {
          setRecords([...newItems, ...PATIENTS]);
        }
      } catch (err) {
        console.warn("EHR API fetch note:", err.message);
      }
    }

    loadEHR();
    return () => { isMounted = false; };
  }, []);

  const filteredPatients =
    activeTab === "All"
      ? records
      : records.filter((p) => p.tab === activeTab);

  const countFor = (tab) =>
    tab === "All"
      ? records.length
      : records.filter((p) => p.tab === tab).length;

  return (
    <div className="bg-[#FAFAFA] min-h-screen p-3 sm:p-5 lg:p-7 xl:p-8 text-gray-800 font-sans selection:bg-emerald-100">

      {/* HEADER SECTION CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 lg:p-6 mb-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm active:scale-95 flex-shrink-0">
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight font-serif">
              Personal Tests and Analysis
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {filteredPatients.length} record{filteredPatients.length !== 1 ? "s" : ""}{" "}
              &middot;{" "}
              {activeTab === "All" ? "All categories" : activeTab}
            </p>
          </div>
        </div>

        {/* Tab Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count = countFor(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ease-in-out flex-shrink-0 active:scale-95 ${
                  isActive
                    ? "bg-[#107C41] text-white shadow-sm shadow-green-200"
                    : "bg-gray-100/80 text-gray-500 hover:bg-gray-200/70 hover:text-gray-800"
                }`}
              >
                {tab}
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold transition-colors duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOWER RESPONSIVE GRID WRAPPER */}
      <div className="flex flex-col xl:flex-row gap-5">
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Patient Cards Sub-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.length > 0
              ? filteredPatients.map((p) => <PatientCard key={p.id} patient={p} />)
              : <EmptyState tab={activeTab} />}
          </div>

          {/* Calendar Block Panel */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 lg:p-6 shadow-sm">
            <CalendarSection />
          </div>
        </div>

        {/* Right Panel — stacks below on mobile/tablet, sidebar on xl+ */}
        <div className="w-full xl:w-72 2xl:w-80 flex-shrink-0">
          <RightPanel />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  );
}
