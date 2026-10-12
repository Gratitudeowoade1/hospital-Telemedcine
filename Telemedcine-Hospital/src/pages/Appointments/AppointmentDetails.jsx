import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  Plus,
  Send,
  Pencil,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Activity,
  Heart,
  CreditCard,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const AppointmentDetails = ({
  appt,
  onClose,
  onUpdateStatus,
  onUpdateMedicalRecord,
  onTriggerAddRecordForm
}) => {
  const [viewMode, setViewMode] = useState('bio'); // 'bio' or 'record-edit'
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [hasSentReminder, setHasSentReminder] = useState(false);

  // Local state for interactive checklist builder matching middle card in Figma
  const [localTreatments, setLocalTreatments] = useState([]);
  const [localPharmacy, setLocalPharmacy] = useState([]);
  const [localReason, setLocalReason] = useState('');

  // Settle local states when appt changes
  useEffect(() => {
    if (appt) {
      const record = appt.medicalRecord || {};
      const firstTreatment = record.treatments?.[0] || {};
      
      // Default to Mock values if readings array is not present to secure beautiful visuals
      setLocalTreatments(firstTreatment.readings || [
        { id: 'r1', name: 'E.E.G Reading 1', done: true },
        { id: 'r2', name: 'E.E.G Reading 2', done: false }
      ]);
      setLocalPharmacy(record.pharmacy || [
        { id: 'p1', name: 'Tegretol', done: true }
      ]);
      setLocalReason(firstTreatment.reason || 'Brain seizures');
    }
  }, [appt, viewMode]);

  if (!appt) return null;

  const bio = appt.bioData || {
    fullName: appt.patientName,
    phone: '+234 704 384 9829',
    email: 'candidate@gmail.com',
    age: 19,
    gender: 'Female',
    address: '4337 lynn garden, brooks, GA 21110, Nigeria.'
  };

  // Convert 24h format to nice 12h format
  const format12Hour = (time24) => {
    if (!time24) return '02:00-03:00PM';
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${String(m).padStart(2, '0')}${ampm}`;
  };

  // Beautiful parsing of Date string to fit "Wed, 6th Nov" or similar short format
  const formatFigmaDateShort = (dateStr) => {
    if (!dateStr) return 'Fri, 16th Nov';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[d.getDay()];
        const monthName = months[d.getMonth()];
        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';
        
        return `${dayName}, ${day}${suffix} ${monthName}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Finished':
        return 'text-emerald-700 border-emerald-200 bg-emerald-50';
      case 'Registered':
        return 'text-[#13B497] border-[#13B497]/30 bg-[#13B497]/5';
      case 'Unfinished':
        return 'text-amber-700 border-amber-200 bg-amber-50';
      default:
        return 'text-gray-700 border-gray-200 bg-gray-50';
    }
  };

  const handleSendReminder = () => {
    setHasSentReminder(true);
    setTimeout(() => setHasSentReminder(false), 2500);
  };

  // Local toggle mechanisms for interactive readings checklist
  const handleLocalToggleTreatment = (id, doneVal) => {
    setLocalTreatments(prev => prev.map(r => r.id === id ? { ...r, done: doneVal } : r));
  };

  const handleLocalTogglePharmacy = (id, doneVal) => {
    setLocalPharmacy(prev => prev.map(p => p.id === id ? { ...p, done: doneVal } : p));
  };

  // Double trigger saving state
  const handleSaveLocalRecord = () => {
    const updatedRecord = {
      treatments: [
        {
          id: 't-custom',
          name: 'E.E.G',
          reason: localReason,
          readings: localTreatments
        }
      ],
      pharmacy: localPharmacy
    };
    onUpdateMedicalRecord(appt.id, updatedRecord);
    setViewMode('bio');
  };

  return (
    <>
      {/* Backdrop backdrop blur */}
      <div 
        id="details-drawer-overlay"
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs z-45 animate-fade-in"
      />

      {/* Slide-out Panel with dynamic width toggle */}
      <div 
        id="details-drawer-panel" 
        className={`fixed inset-y-0 right-0 w-full ${
          isFullWidth ? 'max-w-2xl' : 'max-w-md'
        } bg-white shadow-2xl z-50 flex flex-col h-full transform transition-all duration-300 text-left`}
      >
        
        {/* --- MAIN BODY FOR BIO-DATA & VISUAL STATUS --- */}
        {viewMode === 'bio' ? (
          <>
            {/* Header: EHR Number & Actions */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 select-none">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-black text-slate-800 tracking-wider font-sans uppercase">
                  EHR NUMBER: {appt.ehrNumber || '100235B'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded-full border border-gray-100">
                  <span className="w-1.5 h-1.5 bg-[#13B497] rounded-full animate-pulse"></span>
                  <span>Online Appointment</span>
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setViewMode('record-edit')}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-[#13B497] hover:bg-slate-50 border border-gray-100 transition-all cursor-pointer"
                  title="Configure Medical Records Checklist"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-slate-50 border border-gray-100 transition-all cursor-pointer hidden sm:inline-block"
                  title="Expand Panel Width"
                >
                  {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-100 transition-all cursor-pointer"
                  onClick={onClose}
                  title="Close Detail Drawer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Contents Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Patient Header Box with Initial & Status Selection */}
              <div className="flex items-center justify-between text-left gap-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-fuchsia-600 text-white font-extrabold text-xs flex items-center justify-center shadow-3xs uppercase shrink-0">
                    {appt.patientInitial || appt.patientName?.split(' ').map(n=>n[0]).join('').substring(0,2) || 'AI'}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block font-sans">Patient name</span>
                    <h3 className="text-sm font-black text-gray-900 font-sans tracking-tight mt-0.5">{appt.patientName}</h3>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 select-none">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Change Status</span>
                  <div className="relative inline-block">
                    <select
                      value={appt.status}
                      onChange={(e) => onUpdateStatus(appt.id, e.target.value)}
                      className={`appearance-none border ${getStatusStyle(appt.status)} px-3.5 py-1.5 pr-8.5 rounded-xl text-[10px] font-black focus:outline-hidden focus:ring-1 focus:ring-[#13B497] cursor-pointer font-sans transition-all`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '10px'
                      }}
                    >
                      <option value="Registered">Registered</option>
                      <option value="Finished">Finished</option>
                      <option value="Unfinished">Unfinished</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid of Three Quick Parameters Boxes (Treatment, DateTime, Doctor) - Exactly style as Figma */}
              <div className="grid grid-cols-3 gap-3">
                {/* 1. TREATMENT */}
                <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-3 flex flex-col justify-between text-left h-24 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">TREATMENT</span>
                    <span className="text-xs font-black text-gray-800 truncate block mt-1" title={appt.tag || 'Brain seizures'}>
                      {appt.tag || 'Brain seizures'}
                    </span>
                  </div>
                </div>

                {/* 2. DATE & TIME */}
                <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-3 flex flex-col justify-between text-left h-24 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">DATE & TIME</span>
                    <span className="text-xs font-black text-gray-800 truncate block mt-1" title={`${appt.date} (${appt.startTime || '02:00PM'}-${appt.endTime || '03:00PM'})`}>
                      {formatFigmaDateShort(appt.date)}
                    </span>
                  </div>
                </div>

                {/* 3. DOCTOR */}
                <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-3 flex flex-col justify-between text-left h-24 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">DOCTOR</span>
                    <span className="text-xs font-black text-gray-800 truncate block mt-1" title={appt.doctorName}>
                      {appt.doctorName || 'Dr. Yinusa Grace'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill Payment Segment in Horizontal Row */}
              <div className="p-4 bg-slate-50/40 border border-gray-100 rounded-2xl flex items-center justify-between text-left select-none">
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800">
                  <span className="text-gray-400 font-semibold font-sans">Payment</span>
                  <span className="text-gray-850 font-extrabold font-mono">Bill {appt.payment?.billNo || '#1024'}</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100">
                    {appt.payment?.status || 'UNPAID'}
                  </span>
                </div>
                
                <button 
                  onClick={handleSendReminder}
                  disabled={hasSentReminder}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer select-none active:scale-95 ${
                    hasSentReminder 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-orange-200 hover:bg-orange-50 text-orange-600'
                  }`}
                >
                  <Send className="w-3 h-3 text-orange-500" />
                  <span>Send Reminder</span>
                </button>
              </div>

              {/* Detailed Bio Data Section layout as seen in Left & Right card in Figma */}
              <div className="space-y-4 text-left pt-2">
                <h4 className="text-xs font-black text-gray-900 border-b border-gray-100 pb-2 tracking-wide uppercase">Bio Data</h4>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Full Name</span>
                    <span className="font-extrabold text-slate-800 block truncate">{bio.fullName || appt.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Phone Number</span>
                    <span className="font-semibold text-slate-800 block truncate">{bio.phone || '+234 704 384 9829'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Age</span>
                    <span className="font-bold text-slate-800 block">{bio.age || '19'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">E-mail</span>
                    <span className="font-bold text-slate-800 block truncate">{bio.email || 'candidate@gmail.com'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Gender</span>
                    <span className="font-bold text-slate-800 block">{bio.gender || 'Female'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Home Address</span>
                    <p className="font-semibold text-slate-600 leading-normal tracking-tight font-sans">
                      {bio.address || '4337 lynn garden, brooks, GA 21110, Nigeria.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Row according to mockup layout */}
            <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-1 gap-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                {/* Visual See Medical Record Button */}
                <button
                  onClick={() => setViewMode('record-edit')}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#13B497] hover:bg-[#0fa085] active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>See Medical Record</span>
                </button>
                
                {/* Visual Add Medical Record Dashed Outline Button */}
                <button
                  onClick={() => setViewMode('record-edit')}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-dashed border-[#13B497] hover:bg-[#13B497]/5 text-[#13B497] rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-98"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Add Medical Record</span>
                </button>
              </div>

              {/* Large solid button named 'Finish' spanning the full width of the drawer */}
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-600 font-extrabold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer select-none"
              >
                Finish
              </button>
            </div>
          </>
        ) : (
          
          /* --- "ADD MEDICAL RECORD" INTERACTIVE SLIDING DIALOG (MIDDLE CARD) --- */
          <>
            {/* Slide view Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('bio')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all cursor-pointer shrink-0"
                  title="Return to Bio Data Details"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                  Add Medical Record
                </h2>
              </div>
              
              <button 
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                onClick={onClose}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable checklists form content exactly mirroring Middle Figma Layout */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Patient visual index summary inside record form */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                <div className="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-700 font-black text-[10px] flex items-center justify-center uppercase shrink-0">
                  {appt.patientInitial || 'AI'}
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Configure record for</span>
                  <span className="text-xs font-black text-slate-800">{appt.patientName}</span>
                </div>
              </div>

              {/* Treatment config segment */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block font-sans">Treatment Service</span>
                  <span className="text-sm font-black text-gray-800 block mt-1">E.E.G</span>
                </div>

                <div className="space-y-3">
                  {localTreatments.map((r) => (
                    <div 
                      key={r.id}
                      className="p-4 bg-slate-50/20 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-left gap-3.5"
                    >
                      <span className="text-xs font-bold text-slate-700">{r.name}</span>
                      
                      {/* Side physical toggle switches style matching Figma checklist buttons */}
                      <div className="flex gap-2 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => handleLocalToggleTreatment(r.id, true)}
                          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95 ${
                            r.done 
                              ? 'bg-[#13B497] text-white border-[#13B497] shadow-3xs' 
                              : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-55/40'
                          }`}
                        >
                          <Check className="w-3 h-3 text-current" />
                          <span>Done</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLocalToggleTreatment(r.id, false)}
                          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95 ${
                            !r.done 
                              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-3xs' 
                              : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-55/40'
                          }`}
                        >
                          <X className="w-3 h-3 text-current" />
                          <span>Not Done</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Text area for Reason */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Reason</label>
                  <textarea
                    value={localReason}
                    onChange={(e) => setLocalReason(e.target.value)}
                    placeholder="Type a reason..."
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 h-20 text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#13B497] focus:border-[#13B497] transition-all font-sans font-semibold leading-relaxed"
                  />
                </div>
              </div>

              {/* Pharmacy Segment */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block font-sans">Pharmacy Service</span>
                  <span className="text-sm font-black text-gray-800 block mt-1">Brain seizure Drug</span>
                </div>

                <div className="space-y-3">
                  {localPharmacy.map((p) => (
                    <div 
                      key={p.id}
                      className="p-4 bg-slate-50/20 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-left gap-3.5"
                    >
                      <span className="text-xs font-bold text-slate-700">{p.name}</span>
                      
                      <div className="flex gap-2 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => handleLocalTogglePharmacy(p.id, true)}
                          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95 ${
                            p.done 
                              ? 'bg-[#13B497] text-white border-[#13B497] shadow-3xs' 
                              : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-55/40'
                          }`}
                        >
                          <Check className="w-3 h-3 text-current" />
                          <span>Done</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLocalTogglePharmacy(p.id, false)}
                          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95 ${
                            !p.done 
                              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-3xs' 
                              : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-55/40'
                          }`}
                        >
                          <X className="w-3 h-3 text-current" />
                          <span>Not Done</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions Row (Cancel and Save Record) exactly styled */}
            <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setViewMode('bio')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-slate-55/10 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSaveLocalRecord}
                className="px-6 py-2.5 rounded-xl bg-[#13B497] hover:bg-[#0fa085] text-xs font-black text-white active:scale-95 transition-all shadow-md cursor-pointer select-none"
              >
                Save Record
              </button>
            </div>
          </>
        )}

      </div>
    </>
  );
};

