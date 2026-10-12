import React, { useState, useMemo } from 'react';
import {
    Trash2,
    Eye,
    Search,
    Filter,
    HelpCircle,
    UserCheck,
    CheckCircle2,
    Clock,
    ArrowUpDown
} from 'lucide-react';

export const LogHistory = ({
    appointments,
    onSelectAppointment,
    onDeleteAppointment,
    onStatusChange
}) => {
    const [search, setSearch] = useState('');
    const [filterDoc, setFilterDoc] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortField, setSortField] = useState('startTime');
    const [sortAsc, setSortAsc] = useState(true);

    // Doctors list for dropdown menu
    const doctorsList = [
        'DR. Yinusa Grace',
        'DR. Favour Ayodele',
        'DR. Sophia Akiheme',
        'Dr. Akeem Taiwo'
    ];

    // Table filtering and search
    const handledAppointments = useMemo(() => {
        let list = [...appointments];

        // Filter by search query
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(appt =>
                appt.patientName.toLowerCase().includes(q) ||
                appt.ehrNumber.toLowerCase().includes(q) ||
                appt.tag.toLowerCase().includes(q) ||
                appt.doctorName.toLowerCase().includes(q)
            );
        }

        // Filter by Doctor
        if (filterDoc) {
            list = list.filter(appt => appt.doctorName === filterDoc);
        }

        // Filter by Status
        if (filterStatus) {
            list = list.filter(appt => appt.status === filterStatus);
        }

        // Sort Handler (defaults to time)
        list.sort((a, b) => {
            let valA = a[sortField] || '';
            let valB = b[sortField] || '';

            if (typeof valA === 'string') {
                const compare = valA.localeCompare(valB);
                return sortAsc ? compare : -compare;
            }
            return sortAsc ? (valA > valB ? 1 : -1) : (valA > valB ? -1 : 1);
        });

        return list;
    }, [appointments, search, filterDoc, filterStatus, sortField, sortAsc]);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    // Helper status styling mapper
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Finished':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Finished</span>
                    </span>
                );
            case 'Registered':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-xs">
                        <UserCheck className="w-3 h-3 text-blue-500" />
                        <span>Registered</span>
                    </span>
                );
            case 'Unfinished':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-xs">
                        <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span>Unfinished</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-in fade-in duration-300">

            {/* Search and control filter line */}
            <div className="p-6 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-black text-gray-800 font-sans tracking-tight">EHR Log Audits Table</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Comprehensive historic register of medical diagnostic listings.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Quick Search Input */}
                    <div className="relative min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search table row..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-xs bg-white border border-gray-200 rounded-xl py-1.5 pl-9 pr-3 text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
                        />
                    </div>

                    {/* Quick Doctor filter selector */}
                    <select
                        value={filterDoc}
                        onChange={(e) => setFilterDoc(e.target.value)}
                        className="bg-white border border-gray-200 text-xs text-gray-700 rounded-xl py-1.5 px-3 min-w-[130px] font-semibold outline-hidden hover:bg-gray-50 cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                        <option value="">All Doctors</option>
                        {doctorsList.map(doc => (
                            <option key={doc} value={doc}>{doc}</option>
                        ))}
                    </select>

                    {/* Quick Status filter selector */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-200 text-xs text-gray-700 rounded-xl py-1.5 px-3 min-w-[120px] font-semibold outline-hidden hover:bg-gray-50 cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                        <option value="">All Statuses</option>
                        <option value="Finished">Finished</option>
                        <option value="Registered">Registered</option>
                        <option value="Unfinished">Unfinished</option>
                    </select>
                </div>
            </div>

            {/* Main logs table representation */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50 select-none text-[10px] text-gray-450 uppercase tracking-wider font-extrabold font-sans">
                            <th className="py-4 px-6">
                                <button onClick={() => toggleSort('patientName')} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <span>Patient</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="py-4 px-6">
                                <button onClick={() => toggleSort('date')} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <span>Scheduled Time</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="py-4 px-6">
                                <button onClick={() => toggleSort('doctorName')} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <span>Assigned Specialist</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="py-4 px-6">Checkup Tag</th>
                            <th className="py-4 px-6">Payment Billing</th>
                            <th className="py-4 px-6">EHR Status</th>
                            <th className="py-4 px-6 text-right">Actions Panel</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700 font-sans">
                        {handledAppointments.length > 0 ? (
                            handledAppointments.map((appt) => (
                                <tr
                                    key={appt.id}
                                    className="hover:bg-gray-50/40 transition-colors group"
                                >
                                    {/* Patient Name / Initial Profile badge */}
                                    <td className="py-4.5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-400/10 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-100/30">
                                                {appt.patientInitial}
                                            </div>
                                            <div>
                                                <span className="font-extrabold text-gray-900 block tracking-tight">{appt.patientName}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono mt-0.5 block">
                                                    EHR #{appt.ehrNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Scheduled Date Time details */}
                                    <td className="py-4.5 px-6 font-mono text-gray-550">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-gray-800">{appt.date}</span>
                                            <span className="text-[10px] text-gray-450 mt-0.5">
                                                {appt.startTime} - {appt.endTime}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Assigned Doctor specialization */}
                                    <td className="py-4.5 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{appt.doctorName}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">
                                                {appt.doctorName.includes('Grace') ? 'General' : appt.doctorName.includes('Favour') ? 'Pediatrician' : 'Neurologist'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Checkup Diagnostic Tag */}
                                    <td className="py-4.5 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-150 shadow-2xs">
                                            {appt.tag}
                                        </span>
                                    </td>

                                    {/* Payment invoicing info */}
                                    <td className="py-4.5 px-6">
                                        {appt.payment ? (
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 font-mono text-[11px]">{appt.payment.amount}</span>
                                                <span className={`text-[9px] font-bold mt-1 self-start px-2 py-0.5 rounded-md ${appt.payment.status === 'PAID'
                                                        ? 'bg-emerald-50/70 text-emerald-700'
                                                        : 'bg-rose-50 text-rose-700 font-extrabold'
                                                    }`}>
                                                    {appt.payment.status}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 font-semibold text-[10px]">No Bill Issued</span>
                                        )}
                                    </td>

                                    {/* EHR Status Dropdown/Badge */}
                                    <td className="py-4.5 px-6">
                                        <div className="relative inline-block text-left">
                                            <select
                                                value={appt.status}
                                                onChange={(e) => onStatusChange(appt.id, e.target.value)}
                                                className="bg-transparent border-0 hover:bg-gray-100/50 rounded-lg p-1.5 text-xs font-bold text-gray-800 cursor-pointer focus:ring-1 focus:ring-emerald-500 outline-hidden transition-all"
                                            >
                                                <option value="Finished">Finished</option>
                                                <option value="Registered">Registered</option>
                                                <option value="Unfinished">Unfinished</option>
                                            </select>
                                        </div>
                                    </td>

                                    {/* Actions Tools Panel */}
                                    <td className="py-4.5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1 px-1 opacity-80 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => onSelectAppointment(appt)}
                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                                                title="Inspect Clinical Records"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteAppointment(appt.id)}
                                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                                title="Delete record Row"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <HelpCircle className="w-8 h-8 text-gray-300 animate-bounce" />
                                        <p className="text-xs font-bold font-sans">No matching appointment records match filter audits</p>
                                        <span className="text-[10px] text-gray-300">Try modifying search tags or selected medical parameters</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
