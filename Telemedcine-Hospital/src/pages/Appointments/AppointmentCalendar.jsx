import React from 'react';
import { MoreHorizontal, Plus, Clock, Coffee, Sparkles } from 'lucide-react';
import { DOCTORS } from './mockData';

const TIME_SLOTS = [
    { label: '9am', start: '09:00', end: '10:00', display: '09:00 AM - 10:00 AM' },
    { label: '10am', start: '10:00', end: '11:00', display: '10:00 AM - 11:00 AM' },
    { label: '11am', start: '11:00', end: '12:00', display: '11:00 AM - 12:00 PM' },
    { label: '12pm', start: '12:00', end: '13:00', display: '12:00 PM - 01:00 PM' },
    { label: '1pm', start: '13:00', end: '14:00', display: '01:00 PM - 02:00 PM', isBreak: true },
    { label: '2pm', start: '14:00', end: '15:00', display: '02:00 PM - 03:00 PM' },
    { label: '3pm', start: '15:00', end: '16:00', display: '03:00 PM - 04:00 PM' },
    { label: '4pm', start: '16:00', end: '17:00', display: '04:00 PM - 05:00 PM' }
];

export const AppointmentCalendar = ({
    appointments,
    selectedDate,
    selectedDoctor,
    viewType,
    onSelectAppointment,
    onAddAppointment
}) => {
    // Filter active doctors based on search/dropdown
    const activeDoctors = selectedDoctor
        ? DOCTORS.filter(d => d.name === selectedDoctor)
        : DOCTORS.slice(0, 3); // Default to the main 3 doctors in the figma screenshot

    // Get days of week starting from the current selected date
    const getDaysOfWeek = (baseDateStr) => {
        const base = new Date(baseDateStr);
        const dayOfWeek = base.getDay(); // 0-6
        const sunday = new Date(base);
        sunday.setDate(base.getDate() - dayOfWeek);

        return Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(sunday);
            day.setDate(sunday.getDate() + i);
            const yyyy = day.getFullYear();
            const mm = String(day.getMonth() + 1).padStart(2, '0');
            const dd = String(day.getDate()).padStart(2, '0');
            return {
                dateStr: `${yyyy}-${mm}-${dd}`,
                label: day.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: day.getDate(),
                isToday: day.toDateString() === new Date().toDateString()
            };
        });
    };

    const daysOfWeek = getDaysOfWeek(selectedDate);

    // Status color mapper matching the figma colors beautiful palette
    const getStatusColors = (status) => {
        switch (status) {
            case 'Finished':
                return {
                    bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100/80',
                    indicator: 'bg-emerald-500',
                    text: 'text-emerald-800',
                    tagBg: 'bg-emerald-500/10 text-emerald-800'
                };
            case 'Registered':
                return {
                    bg: 'bg-blue-50/70 hover:bg-blue-100 border-blue-100/70',
                    indicator: 'bg-blue-500',
                    text: 'text-blue-800',
                    tagBg: 'bg-blue-500/10 text-blue-800'
                };
            case 'Unfinished':
                return {
                    bg: 'bg-purple-50 hover:bg-purple-100 border-purple-100/80',
                    indicator: 'bg-amber-500',
                    text: 'text-purple-800',
                    tagBg: 'bg-purple-500/10 text-purple-700'
                };
            default:
                return {
                    bg: 'bg-gray-50 hover:bg-gray-100 border-gray-100',
                    indicator: 'bg-gray-400',
                    text: 'text-gray-700',
                    tagBg: 'bg-gray-200 text-gray-700'
                };
        }
    };

    // Convert time to 12 hour representation (e.g. "09:00" -> "09:00 AM")
    const format12Hour = (time24) => {
        const [h, m] = time24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    if (viewType === 'Week') {
        return (
            <div id="week-view-calendar" className="overflow-x-auto w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="min-w-[800px]">
                    {/* Header row */}
                    <div className="grid grid-cols-8 border-b border-gray-100 pb-4">
                        <div className="text-xs font-semibold text-gray-400 self-center">Time Slot</div>
                        {daysOfWeek.map((day) => (
                            <div
                                key={day.dateStr}
                                className={`flex flex-col items-center py-2.5 rounded-2xl ${day.dateStr === selectedDate ? 'bg-emerald-50 border border-emerald-100' : ''
                                    }`}
                            >
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{day.label}</span>
                                <span className={`text-lg font-bold mt-1 ${day.dateStr === selectedDate ? 'text-emerald-700' : 'text-gray-800'
                                    }`}>
                                    {day.dayNum}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Time Rows */}
                    <div className="divide-y divide-gray-50 relative">
                        {TIME_SLOTS.map((slot) => {
                            if (slot.isBreak) {
                                return (
                                    <div key={slot.start} className="grid grid-cols-8 py-3 bg-dashed-lane">
                                        <div className="text-xs font-medium text-amber-600 flex items-center gap-1.5 pl-2">
                                            <Coffee className="w-3.5 h-3.5" />
                                            <span>{slot.label}</span>
                                        </div>
                                        <div className="col-span-7 flex items-center justify-center border-t border-b border-dashed border-amber-200 py-1.5 bg-amber-50/30 text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                                            ☕ Midday Break / Lunch Rest Slot
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={slot.start} className="grid grid-cols-8 py-4 items-stretch group hover:bg-gray-50/40 transition-colors">
                                    {/* Time label column */}
                                    <div className="text-xs font-bold text-gray-500 flex flex-col justify-center select-none font-mono">
                                        <span>{format12Hour(slot.start).split(' ')[0]}</span>
                                        <span className="text-[10px] text-gray-400 font-normal">{format12Hour(slot.start).split(' ')[1]}</span>
                                    </div>

                                    {/* Day Columns */}
                                    {daysOfWeek.map((day) => {
                                        // Find appointments for this day and slot
                                        const slotAppts = appointments.filter(
                                            a => a.date === day.dateStr && a.startTime === slot.start
                                        );

                                        return (
                                            <div key={day.dateStr} className="px-1.5 min-h-[90px] flex flex-col justify-center relative border-l border-gray-50">
                                                {slotAppts.length > 0 ? (
                                                    <div className="flex flex-col gap-1.5 h-full">
                                                        {slotAppts.map((appt) => {
                                                            const style = getStatusColors(appt.status);
                                                            return (
                                                                <div
                                                                    key={appt.id}
                                                                    onClick={() => onSelectAppointment(appt)}
                                                                    className={`p-3 rounded-2xl border ${style.bg} transition-all duration-200 hover:shadow-xs cursor-pointer flex flex-col h-full text-left relative group/card`}
                                                                >
                                                                    {/* Doctor Avatar small info */}
                                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                                        <span className={`w-2 h-2 rounded-full ${style.indicator}`} />
                                                                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
                                                                            {appt.status}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{appt.patientName}</h4>
                                                                    <span className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">
                                                                        {appt.doctorName.split(' ')[1]}
                                                                    </span>

                                                                    <div className="mt-auto pt-2 flex items-center justify-between">
                                                                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-lg ${style.tagBg} border border-transparent`}>
                                                                            {appt.tag}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => onAddAppointment(activeDoctors[0]?.name || DOCTORS[0].name, slot.start)}
                                                        className="absolute inset-0 m-1 rounded-xl opacity-0 hover:opacity-100 flex items-center justify-center border-2 border-dashed border-gray-200 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all duration-200 text-emerald-600"
                                                        title="Schedule appointment"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // DEFAULT: DAY VIEW (With Doctor Columns exactly like Figma!)
    return (
        <div id="day-view-calendar" className="relative w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-xs overflow-x-auto">
            <div className="min-w-[700px] relative">

                {/* Doctors Columns Headers */}
                <div
                    className="grid border-b border-gray-100 pb-5 items-center mb-1"
                    style={{ gridTemplateColumns: `75px repeat(${activeDoctors.length}, 1fr)` }}
                >
                    {/* Column 0: Time descriptor header */}
                    <div className="flex flex-col text-left pl-1">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">GMT</span>
                        <span className="text-[10px] font-bold text-gray-450 font-mono mt-1">+7:00</span>
                    </div>

                    {activeDoctors.map((doc, idx) => {
                        const docApptsCount = appointments.filter(
                            a => a.doctorName === doc.name && a.date === selectedDate
                        ).length;

                        return (
                            <div key={doc.name} className={`flex items-center gap-3.5 px-4 ${idx > 0 ? 'border-l border-gray-100' : ''}`}>
                                <img
                                    src={doc.avatar}
                                    alt={doc.name}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-105 shadow-3xs"
                                />
                                <div className="text-left">
                                    <h3 className="text-[13px] font-bold text-gray-800 font-sans tracking-tight line-clamp-1">{doc.name}</h3>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-bold bg-emerald-50/70 px-2 py-0.5 rounded-lg w-fit">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        <span>{docApptsCount} Patient{docApptsCount !== 1 ? 's' : ''} Today</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 12:00 PM Live Timeline Red Indicator Line */}
                <div
                    className="absolute right-0 pointer-events-none z-10 flex items-center"
                    style={{
                        left: '75px',
                        top: 'calc(105px + 3 * 110px)' // Perfectly centered over 12pm slot
                    }}
                >
                    <div className="absolute left-0 -translate-x-full pr-2.5 flex items-center gap-1 select-none" style={{ width: '75px', justifyContent: 'flex-end' }}>
                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                            12:00pm
                        </span>
                        <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100 flex-shrink-0"></div>
                    </div>
                    <div className="w-full h-0.5 bg-red-400"></div>
                </div>

                {/* Time Rows and Doctors Cells Grid */}
                <div className="relative mt-2">
                    {TIME_SLOTS.map((slot) => {
                        if (slot.isBreak) {
                            return (
                                <div
                                    key={slot.start}
                                    className="grid items-center py-4 relative group border-b border-dashed border-gray-100/80"
                                    style={{ gridTemplateColumns: `75px repeat(${activeDoctors.length}, 1fr)` }}
                                >
                                    {/* Left row hour label */}
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 select-none pl-1">
                                        <Coffee className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                                        <span>{slot.label}</span>
                                    </div>
                                    {/* Dashed background break panel */}
                                    <div
                                        className="flex items-center justify-between border border-dashed border-amber-200 bg-amber-50/20 px-4 py-2.5 rounded-2xl text-[11px] font-semibold text-amber-700 uppercase tracking-widest"
                                        style={{ gridColumn: `span ${activeDoctors.length}` }}
                                    >
                                        <span>☕ Doctor Lunch Rest Break Time</span>
                                        <span>1:00 PM - 2:00 PM</span>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={slot.start}
                                className="grid items-stretch relative min-h-[110px] group border-b border-dashed border-gray-100/80 hover:bg-gray-50/10 transition-colors"
                                style={{ gridTemplateColumns: `75px repeat(${activeDoctors.length}, 1fr)` }}
                            >
                                {/* Horizontal hour label */}
                                <div className="flex flex-col justify-center text-xs font-bold select-none text-left pl-1 pr-2">
                                    <span className="text-gray-700 tracking-tight font-sans font-extrabold text-[12px]">{slot.label}</span>
                                    <span className="text-[9px] font-normal text-gray-300 font-mono mt-0.5">GMT +7</span>
                                </div>

                                {/* Doctor columns cells */}
                                {activeDoctors.map((doc, idx) => {
                                    const cellAppts = appointments.filter(
                                        a => a.doctorName === doc.name && a.date === selectedDate && a.startTime === slot.start
                                    );

                                    return (
                                        <div key={doc.name} className={`px-4 py-3.5 relative flex flex-col justify-center min-h-[90px] ${idx > 0 ? 'border-l border-gray-100' : ''}`}>
                                            {cellAppts.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {cellAppts.map((appt) => {
                                                        const style = getStatusColors(appt.status);
                                                        return (
                                                            <div
                                                                key={appt.id}
                                                                onClick={() => onSelectAppointment(appt)}
                                                                className={`p-3.5 rounded-2xl border ${style.bg} transition-all duration-200 hover:shadow-2xs cursor-pointer flex flex-col text-left relative group/card active:scale-98`}
                                                            >
                                                                {/* Indicator & Status badge */}
                                                                <div className="flex items-center justify-between gap-1.5 mb-2">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={`w-2 h-2 rounded-full ${style.indicator}`} />
                                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
                                                                            {appt.status}
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-gray-200/50 rounded-lg text-gray-400 hover:text-gray-700 transition-all"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onSelectAppointment(appt);
                                                                        }}
                                                                    >
                                                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>

                                                                {/* Patient Name */}
                                                                <h4 className="text-[13px] font-bold text-gray-800 font-sans tracking-tight">
                                                                    {appt.patientName}
                                                                </h4>

                                                                {/* Action details */}
                                                                <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-medium font-mono">
                                                                    <Clock className="w-3 h-3 text-gray-300" />
                                                                    <span>{format12Hour(appt.startTime).split(' ')[0]} - {format12Hour(appt.endTime).split(' ')[0]} {format12Hour(appt.startTime).split(' ')[1]}</span>
                                                                </div>

                                                                <div className="mt-3 flex items-center justify-between">
                                                                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border ${style.tagBg} border-transparent shadow-3xs`}>
                                                                        {appt.tag}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                /* Empty slot - clickable to schedule */
                                                <button
                                                    onClick={() => onAddAppointment(doc.name, slot.start)}
                                                    className="absolute inset-0 m-2 rounded-2xl opacity-0 group-hover:opacity-100 hover:opacity-100 flex items-center justify-center border-2 border-dashed border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all duration-300 text-emerald-600 focus:outline-hidden"
                                                    title={`Schedule appointment at ${slot.start} with ${doc.name}`}
                                                >
                                                    <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
