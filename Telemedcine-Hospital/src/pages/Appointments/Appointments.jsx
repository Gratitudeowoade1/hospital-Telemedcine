
import React, { useState, useMemo, useEffect } from 'react';
import {
    Bell,
    Settings,
    Plus,
} from 'lucide-react';
import { INITIAL_APPOINTMENTS, DOCTORS } from './mockData';
import { AppointmentFilters } from './AppointmentFilters';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentDetails } from './AppointmentDetails';
import { AppointmentForm } from './AppointmentForm';
import { LogHistory } from './LogHistory';
import api from '../../services/api';

export default function Appointments() {
    // Page state
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
    const [selectedTab, setSelectedTab] = useState('Calendar');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // Fetch real appointments from backend
    useEffect(() => {
        let isMounted = true;

        async function loadAppointments() {
            try {
                const res = await api.getAppointments().catch(() => null);
                if (isMounted && res?.success && res.data?.length) {
                    const mapped = res.data.map(a => ({
                        id: `apt-${a.id}`,
                        apiId: a.id,
                        patientName: a.patient_name || 'Patient',
                        doctorName: a.doctor_name || DOCTORS[0]?.name || 'Dr. Polly Richardson',
                        date: a.appointment_date || '2024-11-06',
                        time: a.appointment_time || '09:00',
                        status: a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase() : 'Upcoming',
                        type: a.type || 'General Consultation',
                        videoLink: a.video_link,
                        fee: a.fee || 50000,
                        diagnosis: a.notes || 'Tele-consultation Checkup',
                        ehrNumber: `EHR-00${a.patient_id || 1}`,
                        tag: 'General',
                        phone: '+234 801 234 5678',
                        email: 'patient@hospital.com',
                        avatar: a.patient_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                    }));
                    setAppointments(mapped);
                }
            } catch (err) {
                console.warn('Appointments fetch note:', err.message);
            }
        }

        loadAppointments();
        return () => { isMounted = false; };
    }, []);

    // Scheduling states
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState('schedule');
    const [formDoctor, setFormDoctor] = useState('');
    const [formTime, setFormTime] = useState('09:00');
    const [clinicalRecordEditAppt, setClinicalRecordEditAppt] = useState(null);

    // Filters State
    const [filters, setFilters] = useState({
        searchQuery: '',
        selectedDoctor: '',
        selectedStatus: '',
        selectedDate: '2024-11-06', // Figma default base date
        viewType: 'Day'
    });

    // Filter handlers
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Filtered Appointments Selector
    const filteredAppointments = useMemo(() => {
        return appointments.filter((appt) => {
            // 1. Date Check (In week view, we let the calendar component handle range distribution)
            const matchesDate = filters.viewType === 'Week' ? true : appt.date === filters.selectedDate;

            // 2. Doctor Check
            const matchesDoctor = filters.selectedDoctor
                ? appt.doctorName === filters.selectedDoctor
                : true;

            // 3. Status Check
            const matchesStatus = filters.selectedStatus
                ? appt.status === filters.selectedStatus
                : true;

            // 4. Search Query Check (Patient, Doctor, Diagnosis tag, EHR Number)
            const q = filters.searchQuery.toLowerCase();
            const matchesQuery = q
                ? appt.patientName.toLowerCase().includes(q) ||
                appt.doctorName.toLowerCase().includes(q) ||
                appt.tag.toLowerCase().includes(q) ||
                appt.ehrNumber.toLowerCase().includes(q)
                : true;

            return matchesDate && matchesDoctor && matchesStatus && matchesQuery;
        });
    }, [appointments, filters]);

    // Appointment mutator: Status modification
    const handleUpdateStatus = (id, newStatus) => {
        // Sync to backend API if applicable
        const target = appointments.find(a => a.id === id);
        const apiStatus = newStatus.toUpperCase(); // 'UPCOMING', 'COMPLETED', 'CANCELLED'
        const targetApiId = target?.apiId || parseInt(id.replace(/\D/g, '')) || 1;
        api.updateAppointmentStatus(targetApiId, apiStatus).catch(err => {
            console.warn('Backend appointment status update note:', err.message);
        });

        setAppointments(prev => prev.map(appt => {
            if (appt.id === id) {
                return { ...appt, status: newStatus };
            }
            return appt;
        }));

        // Auto sync selected details card
        if (selectedAppointment && selectedAppointment.id === id) {
            setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    // Appointment mutator: Medical Record update
    const handleUpdateMedicalRecord = (id, updatedRecord) => {
        setAppointments(prev => prev.map(appt => {
            if (appt.id === id) {
                return { ...appt, medicalRecord: updatedRecord };
            }
            return appt;
        }));

        if (selectedAppointment && selectedAppointment.id === id) {
            setSelectedAppointment(prev => prev ? { ...prev, medicalRecord: updatedRecord } : null);
        }
    };

    // Trigger appointment scheduler
    const handleAddNewAppointment = (doctorName, timeStart) => {
        setFormDoctor(doctorName);
        setFormTime(timeStart);
        setFormMode('schedule');
        setShowForm(true);
    };

    // Trigger record checklist editor (Desktop 4 modal)
    const handleTriggerAddRecordForm = (appt) => {
        setClinicalRecordEditAppt(appt);
        setFormMode('clinical-record');
        setShowForm(true);
    };

    // Save new appointment or clinical record
    const handleFormSubmit = async (formData) => {
        if (formMode === 'schedule') {
            // Send to backend API
            let serverId = 'apt-' + Date.now();
            let videoLink = 'https://meet.telemedcine.com/room-' + Math.floor(100 + Math.random() * 900);
            try {
                const res = await api.createAppointment({
                    patient_id: 1,
                    doctor_id: 1,
                    appointment_date: formData.date || filters.selectedDate,
                    appointment_time: formData.time || formTime,
                    type: formData.type || 'General Consultation',
                    notes: formData.diagnosis || 'Clinical tele-consultation'
                });
                if (res?.appointmentId) {
                    serverId = `apt-${res.appointmentId}`;
                }
                if (res?.video_link) {
                    videoLink = res.video_link;
                }
            } catch (err) {
                console.warn('Backend appointment creation note:', err.message);
            }

            const created = {
                id: serverId,
                videoLink,
                ...formData
            };

            setAppointments(prev => [created, ...prev]);
            triggerToast('Appointment scheduled successfully!');
        } else {
            // Editing medical record details
            if (clinicalRecordEditAppt) {
                setAppointments(prev => prev.map(appt => {
                    if (appt.id === clinicalRecordEditAppt.id) {
                        return {
                            ...appt,
                            tag: formData.tag || appt.tag,
                            medicalRecord: formData.medicalRecord
                        };
                    }
                    return appt;
                }));

                // Auto sync selected drawer details
                if (selectedAppointment && selectedAppointment.id === clinicalRecordEditAppt.id) {
                    setSelectedAppointment(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            tag: formData.tag || prev.tag,
                            medicalRecord: formData.medicalRecord
                        };
                    });
                }
                triggerToast('Medical EHR checklists saved successfully.');
            }
        }
        setShowForm(false);
        setClinicalRecordEditAppt(null);
    };

    // Delete handler
    const handleDeleteAppointment = (id) => {
        setAppointments(prev => prev.filter(a => a.id !== id));
        triggerToast('Appointment listing deleted from record.');
    };

    const triggerToast = (msg) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            <main className="flex-1 flex flex-col overflow-hidden w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6">

                {/* TOP COMPACT BAR/HEADER exactly like Figma */}
                <header className="flex items-center justify-between pb-6 border-b border-gray-100 w-full mb-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 id="main-heading" className="text-xl font-black text-gray-900 font-sans tracking-tight">Appointments</h1>
                            <p className="text-[11px] text-gray-400 mt-0.5">Control clinical checkup scheduling, patient listings, and diagnostic records audits.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleAddNewAppointment(DOCTORS[0].name, '09:00')}
                            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/15"
                        >
                            <Plus className="w-4 h-4" />
                            New Appointment
                        </button>

                        <button
                            id="notifications-button"
                            onClick={() => triggerToast('No unread alerts')}
                            className="p-2.5 hover:bg-white text-gray-400 hover:text-gray-600 rounded-xl border border-transparent hover:border-gray-100 transition-all cursor-pointer relative shadow-3xs"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Nav settings trigger */}
                        <button
                            id="settings-trigger"
                            onClick={() => triggerToast('Administrative settings panel is locked')}
                            className="p-2.5 hover:bg-white text-gray-400 hover:text-gray-600 rounded-xl border border-transparent hover:border-gray-100 transition-all cursor-pointer shadow-3xs"
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        <span className="w-[1px] h-6 bg-gray-200"></span>

                        {/* Nav user credentials profile badge */}
                        <div className="flex items-center gap-2.5 ml-1">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
                                alt="Ade Josephine"
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-100"
                            />
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-xs font-bold text-gray-850">Ade Josephine</span>
                                <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider mt-0.5">ADMINISTRATOR</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* TABS SELECTOR (Calendar & Log History) */}
                <div id="pages-tabs-nav" className="flex border-b border-gray-150 mb-6 gap-6">
                    <button
                        onClick={() => setSelectedTab('Calendar')}
                        className={`pb-3 text-xs font-bold transition-all relative ${selectedTab === 'Calendar'
                            ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600'
                            : 'text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setSelectedTab('Log History')}
                        className={`pb-3 text-xs font-bold transition-all relative ${selectedTab === 'Log History'
                            ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600'
                            : 'text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        Log History
                    </button>
                </div>

                {/* Dynamic component container view */}
                <div className="flex-1 space-y-6">

                    {selectedTab === 'Calendar' && (
                        /* CALENDAR WORKSPACES */
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* FILTERS COLUMN */}
                            <AppointmentFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                totalCount={filteredAppointments.length}
                            />

                            {/* CALENDAR SCHEDULER VIEW MATRIX */}
                            <AppointmentCalendar
                                appointments={filteredAppointments}
                                selectedDate={filters.selectedDate}
                                selectedDoctor={filters.selectedDoctor}
                                viewType={filters.viewType}
                                onSelectAppointment={setSelectedAppointment}
                                onAddAppointment={handleAddNewAppointment}
                            />
                        </div>
                    )}

                    {selectedTab === 'Log History' && (
                        /* --- LOG HISTORY TABLES --- */
                        <div className="animate-in fade-in duration-305">
                            <LogHistory
                                appointments={appointments}
                                onSelectAppointment={setSelectedAppointment}
                                onDeleteAppointment={handleDeleteAppointment}
                                onStatusChange={handleUpdateStatus}
                            />
                        </div>
                    )}

                </div>

            </main>

            {/* --- FLOATING TOASTS NOTIFICATIONS BANNER --- */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-gray-900 border border-gray-800 text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3.5 z-50 animate-in fade-in slide-in-from-bottom-5 font-sans">
                    <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-400">
                        <Plus className="w-4 h-4 stroke-[3px]" />
                    </div>
                    <div>
                        <p className="text-xs font-bold">{toastMsg}</p>
                    </div>
                </div>
            )}

            {/* --- APPOINTMENT DETAILS DRAWER (Desktop-3 Side-over panel) --- */}
            {selectedAppointment && (
                <AppointmentDetails
                    appt={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateMedicalRecord={handleUpdateMedicalRecord}
                    onTriggerAddRecordForm={handleTriggerAddRecordForm}
                />
            )}

            {/* --- GENERAL SCHEDULING & CLINICAL RECORD DIALOG MODAL (Desktop-4 Add Medical Record layout) --- */}
            {showForm && (
                <AppointmentForm
                    initialDoctor={formDoctor}
                    initialTime={formTime}
                    initialDate={filters.selectedDate}
                    editAppt={clinicalRecordEditAppt}
                    onClose={() => {
                        setShowForm(false);
                        setClinicalRecordEditAppt(null);
                    }}
                    onSubmit={handleFormSubmit}
                    mode={formMode}
                />
            )}

        </div>
    );
}
