import React, { useState, useEffect } from 'react';
import {
    X,
    User,
    Calendar,
    Clock,
    Tag,
    Heart,
    Plus,
    Trash2,
    FileText,
    Bookmark,
    CheckCircle2,
    HelpCircle
} from 'lucide-react';
import { DOCTORS } from './mockData';

export const AppointmentForm = ({
    initialDoctor,
    initialTime,
    initialDate,
    editAppt,
    onClose,
    onSubmit,
    mode
}) => {
    // Common states
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [address, setAddress] = useState('');
    const [doctorName, setDoctorName] = useState(initialDoctor || (DOCTORS[0] ? DOCTORS[0].name : ''));
    const [date, setDate] = useState(initialDate || '2024-11-06');
    const [startTime, setStartTime] = useState(initialTime || '09:00');
    const [tag, setTag] = useState('General Checkup');

    // Clinical diagnostic custom checklist states (Mode 2: 'clinical-record')
    const [diagnosisTag, setDiagnosisTag] = useState('');
    const [treatmentName, setTreatmentName] = useState('');
    const [treatmentReason, setTreatmentReason] = useState('');

    // Array of readings & prescriptions
    const [readingsList, setReadingsList] = useState([]);
    const [newReading, setNewReading] = useState('');

    const [pharmacyList, setPharmacyList] = useState([]);
    const [newPrescription, setNewPrescription] = useState('');

    // Hydrate states if editing
    useEffect(() => {
        if (mode === 'clinical-record' && editAppt) {
            setDiagnosisTag(editAppt.tag || 'General Assessment');

            const record = editAppt.medicalRecord || {};
            const firstTreatment = record.treatments?.[0] || {};

            setTreatmentName(firstTreatment.name || 'Clinical Readings');
            setTreatmentReason(firstTreatment.reason || 'Periodic clinical evaluation');
            setReadingsList(firstTreatment.readings || [
                { id: '1', name: 'Blood Pressure Assessment', done: false },
                { id: '2', name: 'Weight & Body Mass evaluation', done: false }
            ]);
            setPharmacyList(record.pharmacy || [
                { id: '1', name: 'Essential Vitamin Supplements', done: false }
            ]);
        }
    }, [mode, editAppt]);

    // Handle adding checklist parameter items
    const handleAddReading = () => {
        if (newReading.trim()) {
            setReadingsList(prev => [
                ...prev,
                { id: 'r-' + Date.now(), name: newReading.trim(), done: false }
            ]);
            setNewReading('');
        }
    };

    const handleRemoveReading = (id) => {
        setReadingsList(prev => prev.filter(r => r.id !== id));
    };

    const handleAddPrescription = () => {
        if (newPrescription.trim()) {
            setPharmacyList(prev => [
                ...prev,
                { id: 'p-' + Date.now(), name: newPrescription.trim(), done: false }
            ]);
            setNewPrescription('');
        }
    };

    const handleRemovePrescription = (id) => {
        setPharmacyList(prev => prev.filter(p => p.id !== id));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (mode === 'schedule') {
            // Create new appointment payload
            const apptData = {
                patientName: patientName || 'Anonymous Candidate',
                patientInitial: (patientName || 'AC').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                date: date,
                startTime: startTime,
                endTime: calculateEndTime(startTime),
                doctorName: doctorName,
                tag: tag,
                status: 'Registered',
                ehrNumber: String(Math.floor(100000 + Math.random() * 900000)) + 'X',
                payment: {
                    billNo: '#' + Math.floor(1000 + Math.random() * 9000),
                    amount: 'NGN 12,500.00',
                    status: 'UNPAID'
                },
                bioData: {
                    fullName: patientName || 'Anonymous Candidate',
                    phone: phone || '+234 800 000 0000',
                    email: email || 'candidate@gmail.com',
                    age: age ? Number(age) : 30,
                    gender: gender,
                    address: address || 'No address registered'
                }
            };
            onSubmit(apptData);
        } else {
            // Clinical record saving mode
            const updatedRecord = {
                tag: diagnosisTag,
                medicalRecord: {
                    treatments: [
                        {
                            id: 't-custom',
                            name: treatmentName || 'Clinical Examination',
                            reason: treatmentReason || 'Administrative checklist assessment',
                            readings: readingsList
                        }
                    ],
                    pharmacy: pharmacyList
                }
            };
            onSubmit(updatedRecord);
        }
    };

    const calculateEndTime = (start) => {
        const [h, m] = start.split(':').map(Number);
        const newH = (h + 1) % 24;
        return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    return (
        <>
            <div
                id="appointment-modal-overlay"
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-fade-in"
            />

            <div
                id="appointment-modal"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl border border-gray-150 shadow-2xl z-55 flex flex-col max-h-[90vh] overflow-hidden animate-zoom-in"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            {mode === 'schedule' ? 'Clinic Scheduler' : 'Specialist Board'}
                        </span>
                        <h2 className="text-base font-black text-gray-800 mt-2 font-sans tracking-tight">
                            {mode === 'schedule' ? 'Schedule New Patient Appointment' : `Configure Clinical EHR Checklist (${editAppt?.patientName})`}
                        </h2>
                    </div>
                    <button
                        id="close-modal-button"
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">

                        {mode === 'schedule' ? (
                            /* Mode 1: Main Scheduling form */
                            <div className="space-y-5 text-left text-xs font-semibold">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Patient Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Alaba Adekunle"
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-gray-805 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Mobile Line</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="e.g. +234 811 555 3322"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-805 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Patient Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="e.g. alaba@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Patient Age</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="e.g. 29"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Gender</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-750 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans animate-none"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-gray-400 uppercase text-[10px] tracking-wider">Residential Home Address</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 12 GRA Phase 1, Port Harcourt"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                    />
                                </div>

                                <div className="w-full h-[1px] bg-gray-100 my-4"></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Specialist Consultant</label>
                                        <select
                                            value={doctorName}
                                            onChange={(e) => setDoctorName(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-750 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                        >
                                            {DOCTORS.map((d) => (
                                                <option key={d.name} value={d.name}>
                                                    {d.name} ({d.specialty})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Checkup Label / Tag</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Diagnostics Follow-up"
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Appointment Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                required
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Hours Starting Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="time"
                                                required
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            /* Mode 2: Clinical EHR Checklist setup matching special visual requirements */
                            <div className="space-y-5 text-left text-xs font-semibold">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">EHR Diagnose Tag / Label</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={diagnosisTag}
                                                onChange={(e) => setDiagnosisTag(e.target.value)}
                                                className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-gray-400 uppercase text-[10px] tracking-wider">Clinical Examination Headline</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Brain seizure assessment"
                                            value={treatmentName}
                                            onChange={(e) => setTreatmentName(e.target.value)}
                                            className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-850 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-gray-400 uppercase text-[10px] tracking-wider">Consultation Assessment and Symptoms Logs</label>
                                    <textarea
                                        placeholder="Insert elaborate diagnostic logs, physical symptomatologies, or referral assessments..."
                                        value={treatmentReason}
                                        onChange={(e) => setTreatmentReason(e.target.value)}
                                        className="w-full text-xs bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-850 min-h-[90px] focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium font-sans leading-relaxed"
                                    />
                                </div>

                                {/* Interactive checklist item builder for Readings parameters */}
                                <div className="bg-emerald-50/15 border border-emerald-100/30 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Configure Diagnostics Readings Checklist</span>
                                        <span className="text-[9px] text-gray-400 font-bold">({readingsList.length} Items Configured)</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. Blood Pressure 120/80"
                                            value={newReading}
                                            onChange={(e) => setNewReading(e.target.value)}
                                            className="flex-1 text-xs bg-white border border-gray-250 rounded-xl px-3 py-2 text-gray-850 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddReading}
                                            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl px-4 py-2 font-black transition-all cursor-pointer flex items-center gap-1 shadow-3xs text-[11px]"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Add</span>
                                        </button>
                                    </div>

                                    {readingsList.length > 0 ? (
                                        <div className="divide-y divide-gray-100/50 max-h-[160px] overflow-y-auto pr-1">
                                            {readingsList.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between py-2 bg-white/40 px-2 rounded-lg mt-1 first:mt-0">
                                                    <span className="text-xs text-gray-600 font-bold font-sans">{item.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveReading(item.id)}
                                                        className="p-1 text-gray-400 hover:text-rose-600 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-400 italic font-medium">Add parameters like body temperature, EEG waves tracking or physical metrics checklists.</p>
                                    )}
                                </div>

                                {/* Dynamic medical prescription list builder */}
                                <div className="bg-blue-50/15 border border-blue-100/30 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Physician Drug Pharmacy Prescriptions</span>
                                        <span className="text-[9px] text-gray-400 font-bold">({pharmacyList.length} Pharmacy Drugs)</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. Paracetamol 500mg (2x daily)"
                                            value={newPrescription}
                                            onChange={(e) => setNewPrescription(e.target.value)}
                                            className="flex-1 text-xs bg-white border border-gray-250 rounded-xl px-3 py-2 text-gray-850 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddPrescription}
                                            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl px-4 py-2 font-black transition-all cursor-pointer flex items-center gap-1 shadow-3xs text-[11px]"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Prescribe</span>
                                        </button>
                                    </div>

                                    {pharmacyList.length > 0 ? (
                                        <div className="divide-y divide-gray-105 max-h-[160px] overflow-y-auto pr-1">
                                            {pharmacyList.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between py-2 bg-white/40 px-2 rounded-lg mt-1 first:mt-0">
                                                    <span className="text-xs text-gray-650 font-bold font-sans">{item.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePrescription(item.id)}
                                                        className="p-1 text-gray-400 hover:text-rose-600 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-400 italic font-medium">Add necessary medical items or drug specifications.</p>
                                    )}
                                </div>

                            </div>
                        )}

                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-gray-220 text-xs font-black text-gray-550 hover:bg-white active:scale-95 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`px-6 py-2.5 rounded-xl text-xs font-black text-white active:scale-95 transition-all shadow-md cursor-pointer ${mode === 'schedule' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {mode === 'schedule' ? 'Confirm Appointment' : 'Save EHR Checklist'}
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
};
