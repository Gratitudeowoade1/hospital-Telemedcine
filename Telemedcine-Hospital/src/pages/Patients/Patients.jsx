import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  ChevronRight, 
  MessageSquare, 
  FileText, 
  Heart, 
  Bell 
} from 'lucide-react';
import api from '../../services/api';

export default function PatientDashboard() {
  const [patient, setPatient] = useState({
    name: 'Akin Yemi',
    bloodPressure: '120/80',
    heartRate: '72',
  });
  const [upcomingAppt, setUpcomingAppt] = useState({
    title: 'General Consultation with Dr. Richardson',
    dateTime: 'Today, Oct 24 • 02:30 PM',
    videoLink: 'https://meet.telemedcine.com/room-204',
  });
  const [medicalHistory, setMedicalHistory] = useState([
    { title: 'Annual Health Checkup', date: 'General Clinic • Oct 10, 2024', status: 'Completed', icon: '/Icon (4).png', bg: 'bg-blue-50 text-blue-600', badge: 'bg-[#86F898] text-emerald-800' },
    { title: 'Blood Test Results', date: 'Pathology Lab • Sep 28, 2024', status: 'Review Sent', icon: '/Icon (3).png', bg: 'bg-red-50 text-red-500', badge: 'bg-[#CAE4D1] text-gray-500' }
  ]);

  useEffect(() => {
    let isMounted = true;

    async function loadPatientDetails() {
      try {
        // Try getMe or getPatientById(1)
        const [meRes, patientRes] = await Promise.all([
          api.getMe().catch(() => null),
          api.getPatientById(1).catch(() => null),
        ]);

        const profile = meRes?.user || patientRes?.data;
        if (isMounted && profile) {
          setPatient((prev) => ({
            ...prev,
            name: profile.full_name || prev.name,
            bloodPressure: profile.blood_group ? `${profile.blood_group} group` : prev.bloodPressure,
          }));

          if (profile.appointments?.length) {
            const next = profile.appointments[0];
            setUpcomingAppt({
              title: next.type || 'General Consultation',
              dateTime: `${next.appointment_date} • ${next.appointment_time}`,
              videoLink: next.video_link,
            });
          }

          if (profile.labTests?.length) {
            const mappedHistory = profile.labTests.map((t) => ({
              title: t.test_name,
              date: `${t.category || 'Laboratory'} • ${t.test_date}`,
              status: t.status || 'Completed',
              icon: '/Icon (3).png',
              bg: 'bg-red-50 text-red-500',
              badge: 'bg-[#86F898] text-emerald-800',
            }));
            setMedicalHistory(mappedHistory);
          }
        }
      } catch (err) {
        console.warn('Patient dashboard API note:', err.message);
      }
    }

    loadPatientDetails();
    return () => { isMounted = false; };
  }, []);
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 font-sans text-[#333333]">
      
      {/* ================= HEADER SECTION ================= */}
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">Hello, {patient.name}</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base font-normal">Here is a summary of your health and upcoming care activities.</p>
      </header>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* ================= LEFT MAIN CONTENT COLUMN (2/3 width on desktop) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GREEN UPCOMING APPOINTMENT BANNER */}
          <div className="bg-[#10AD69] text-white p-6 rounded-2xl relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4">
              <span className="inline-block bg-white/20 text-xs px-4 py-1.5 rounded-full font-medium tracking-wide">
                Next Appointment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug max-w-md">
                {upcomingAppt.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-emerald-50 font-medium">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{upcomingAppt.dateTime}</span>
              </div>
            </div>
            
            {/* Join Video Call Button */}
            <button 
              onClick={() => {
                if (upcomingAppt.videoLink) {
                  window.open(upcomingAppt.videoLink, '_blank');
                } else {
                  alert('Video consultation session is being initialized...');
                }
              }}
              className="w-full sm:w-auto bg-white text-[#10B981] hover:bg-emerald-50 transition-colors font-bold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm whitespace-nowrap text-base flex-shrink-0"
            >
              <Video className="w-5 h-6 fill-[#10B981]" />
              <span>Join Video Call</span>
            </button>
          </div>
 
          {/* QUICK ACTIONS & HEALTH VITALS (RESPONSIVE FLEX/GRID COMBO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* QUICK ACTIONS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="text-xxs font-bold text-[#1A1A1A]">Quick Actions</h3>
              <div className="space-y-3 flex-grow">
                <button className="w-full flex items-center justify-between border border-[#10B981] text-gray-700 bg-white px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all font-semibold group text-base">
                  <div className="flex items-center gap-3 min-w-0">
                    <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="truncate">Book Appointment</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                </button>
                <button className="w-full flex items-center justify-between border border-[#10B981] text-gray-700 bg-white px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all font-semibold group text-base">
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="truncate">Message Doctor</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                </button>
                <button className="w-full flex items-center justify-between border border-[#10B981] text-gray-700 bg-white px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all font-semibold group text-base">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="truncate">My Records</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* HEALTH VITALS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-baseline mb-4 gap-2">
                <h3 className="text-xxs font-bold text-[#1A1A1A]">Health Vitals</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">Last updated 1h ago</span>
              </div>
              
              {/* Internal items display side-by-side on mobile, but stack vertically on extreme micro-screens */}
              <div className="grid grid-cols-2 gap-4 flex-grow content-center">
                {/* Blood Pressure Card */}
                <div className="bg-[#F8F9FA] p-3 rounded-xl flex flex-col justify-between min-h-[150px]">
                  <div className="middle my-5">
                  <span className="text-xs font-semibold text-gray-500">Blood Pressure</span>
                    <span className="text-[15px] font-bold text-[#1A1A1A] block">120/80 <span className="text-[10px] font-normal text-gray-500">mmhg</span></span> 
                    
                    {/* <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">mmHg</span> */}
                  </div>
                </div>
                {/* Heart Rate Card */}
                <div className="bg-[#F8F9FA] p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
                  {/* <div className="flex justify-between items-center"> */}
                    {/* <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" /> */}
                  {/* </div> */}
                  <div className="middle my-4">
                    <span className="text-xs font-semibold text-gray-500">Heart Rate❤️</span>
                    <span className="text-[15px] font-bold text-[#1A1A1A] block">72 <span className="text-xs font-normal text-gray-500">bpm</span></span>
                    <div className="w-12 bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[70%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RECENT MEDICAL HISTORY */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Recent Medical History</h3>
              <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">View All</button>
            </div>
            
            {/* The structural divider <hr /> line */}
            <hr className="border-gray-100" />

            {/* List Rows Layout */}
            <div className="divide-y divide-gray-100">
              {medicalHistory.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-3 ${item.bg || 'bg-blue-50 text-blue-600'} rounded-full flex-shrink-0`}>
                      <img src={item.icon || '/Icon (4).png'} alt="" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1A1A1A] text-base sm:text-lg truncate">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">{item.date}</p>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 ${item.badge || 'bg-[#86F898] text-emerald-800'} text-xs font-semibold px-3 py-1 rounded-full`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR COLUMN (1/3 width on desktop) ================= */}
        <div className="space-y-6">
          
          {/* NOTIFICATIONS BLOCK */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#1A1A1A]">
              <Bell className="w-5 h-5 text-gray-700 flex-shrink-0" />
              <h3 className="text-xl font-bold">Notifications</h3>
            </div>
            
            {/* Notification 1: Prescription Refill (Exact Maroon Color) */}
            <div className="border-l-4 border-[#800020] bg-[#FFF5F5] p-4 rounded-r-xl space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base">Prescription Refill</h4>
                <span className="text-xs text-gray-400 whitespace-nowrap">2h ago</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Your prescription for Metformin (500mg) is ready for pickup at Main Street Pharmacy.
              </p>
              <button className="w-full bg-[#7A0C1E] hover:bg-[#5C0916] transition-colors text-white font-semibold text-sm py-2.5 rounded-lg text-center tracking-wide shadow-sm">
                View Details
              </button>
            </div>

            {/* Notification 2: Insurance Update */}
            <div className="border border-[#D0D3DF]-100 bg-[#F1F4F6] p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base">Insurance Update</h4>
                <span className="text-xs text-gray-400 whitespace-nowrap">Yesterday</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Your claim for the Sep 15 visit has been processed successfully.
              </p>
            </div>
          </div>

          {/* DAILY HEALTH TIP BLOCK (Solid Gray Profile Canvas from image) */}
          <div className="bg-[#C4C4C4] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden min-h-[170px] flex flex-col justify-between">
            <div className="space-y-2 z-10">
              <h3 className="text-xl font-bold text-white">Daily Health Tip</h3>
              <p className="text-sm text-white/90 leading-relaxed font-medium max-w-[85%]">
                Drinking 8 glasses of water daily helps maintain energy levels and brain function.
              </p>
            </div>
            <button className="bg-transparent hover:bg-white/10 transition-colors text-white font-medium text-xs px-4 py-2 rounded-lg self-start z-10 border border-white/40">
              Learn More
            </button>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-15 pointer-events-none">
              <Heart className="w-24 h-24 stroke-[1px]" />
            </div>
          </div>

          {/* PATIENT PROFILE CARD */}
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/User Profile Snapshot.png"
                alt="Akin Yemi" 
                className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-[#1A1A1A] text-base sm:text-lg truncate">Akin Yemi</h4>
                <p className="text-xs text-gray-400">Member since 2026</p>
              </div>
            </div>
            
            {/* Vitals breakdown row */}
            <div className="grid grid-cols-3 border-t border-gray-100 pt-4 text-center divide-x divide-gray-100">
              <div className="px-1">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 block uppercase tracking-wider truncate">Blood</span>
                <span className="text-base sm:text-lg font-bold text-[#1A1A1A]">A+</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 block uppercase tracking-wider truncate">Weight</span>
                <span className="text-base sm:text-lg font-bold text-[#1A1A1A] whitespace-nowrap">68 kg</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 block uppercase tracking-wider truncate">Age</span>
                <span className="text-base sm:text-lg font-bold text-[#1A1A1A]">34</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
