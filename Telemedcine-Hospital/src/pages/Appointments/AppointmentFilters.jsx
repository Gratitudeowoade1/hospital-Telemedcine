import React, { useState } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    UserCheck
} from 'lucide-react';

export const AppointmentFilters = ({
    filters,
    onFilterChange,
    totalCount
}) => {
    const [showStatusFilter, setShowStatusFilter] = useState(false);

    // Helper to format date wonderfully (e.g. Wednesday, 6 Nov 2024)
    const formatFriendlyDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const handlePrevDay = () => {
        const current = new Date(filters.selectedDate);
        current.setDate(current.getDate() - 1);
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        onFilterChange({ selectedDate: `${yyyy}-${mm}-${dd}` });
    };

    const handleNextDay = () => {
        const current = new Date(filters.selectedDate);
        current.setDate(current.getDate() + 1);
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        onFilterChange({ selectedDate: `${yyyy}-${mm}-${dd}` });
    };

    const handleToday = () => {
        onFilterChange({ selectedDate: '2024-11-06' });
    };

    // Doctors list for dropdown
    const doctorsList = [
        'DR. Yinusa Grace',
        'DR. Favour Ayodele',
        'DR. Sophia Akiheme',
        'Dr. Akeem Taiwo'
    ];

    return (
        <div id="appointment-filters-container" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-gray-100">
            {/* Date controls column */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-emerald-100 shadow-xs">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{totalCount} Total Appointment{totalCount !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                        id="today-filter"
                        onClick={handleToday}
                        className="px-3.5 py-1.5 text-xs font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-all text-gray-600 bg-transparent active:scale-95"
                    >
                        Today
                    </button>
                    <div className="w-[1px] h-4 bg-gray-200"></div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrevDay}
                            className="p-1 rounded-md text-gray-500 hover:bg-white hover:text-gray-900 transition-all active:scale-90"
                            title="Previous Day"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-semibold text-gray-800 px-1 min-w-[130px] text-center select-none font-sans">
                            {formatFriendlyDate(filters.selectedDate)}
                        </span>
                        <button
                            onClick={handleNextDay}
                            className="p-1 rounded-md text-gray-500 hover:bg-white hover:text-gray-900 transition-all active:scale-90"
                            title="Next Day"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Day / Week switch */}
                <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                        onClick={() => onFilterChange({ viewType: 'Day' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filters.viewType === 'Day'
                                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => onFilterChange({ viewType: 'Week' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filters.viewType === 'Week'
                                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Week
                    </button>
                </div>
            </div>

            {/* Specialty Filter, Doctor filter, More Filters controls */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        id="filters-search-input"
                        type="text"
                        placeholder="Search patient, EHR, tag..."
                        value={filters.searchQuery}
                        onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-sans"
                    />
                </div>

                {/* Doctor selector */}
                <select
                    id="doctor-select-filter"
                    value={filters.selectedDoctor}
                    onChange={(e) => onFilterChange({ selectedDoctor: e.target.value })}
                    className="bg-gray-50 border border-gray-200 text-xs text-gray-700 rounded-xl py-1.5 px-3 min-w-[130px] font-medium outline-hidden hover:bg-gray-100 cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                    <option value="">All Doctors</option>
                    {doctorsList.map((docName) => (
                        <option key={docName} value={docName}>
                            {docName}
                        </option>
                    ))}
                </select>

                {/* General popup filters selector */}
                <div className="relative">
                    <button
                        id="filters-trigger"
                        onClick={() => setShowStatusFilter(!showStatusFilter)}
                        className={`flex items-center gap-1.5 bg-gray-50 border text-xs font-medium px-3.5 py-1.5 rounded-xl hover:bg-gray-100 transition-all cursor-pointer ${filters.selectedStatus
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                                : 'border-gray-200 text-gray-600'
                            }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filters</span>
                        {filters.selectedStatus && (
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        )}
                    </button>

                    {showStatusFilter && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowStatusFilter(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                                <h3 className="text-xs font-semibold text-gray-400 px-2.5 pb-2 border-b border-gray-50">Filter Status</h3>
                                <div className="flex flex-col gap-1 mt-2">
                                    <button
                                        onClick={() => {
                                            onFilterChange({ selectedStatus: '' });
                                            setShowStatusFilter(false);
                                        }}
                                        className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${filters.selectedStatus === ''
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <SlidersHorizontal className="w-3.5 h-3.5" />
                                        All Statuses
                                    </button>
                                    <button
                                        onClick={() => {
                                            onFilterChange({ selectedStatus: 'Finished' });
                                            setShowStatusFilter(false);
                                        }}
                                        className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${filters.selectedStatus === 'Finished'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        Finished
                                    </button>
                                    <button
                                        onClick={() => {
                                            onFilterChange({ selectedStatus: 'Registered' });
                                            setShowStatusFilter(false);
                                        }}
                                        className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${filters.selectedStatus === 'Registered'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                        Registered
                                    </button>
                                    <button
                                        onClick={() => {
                                            onFilterChange({ selectedStatus: 'Unfinished' });
                                            setShowStatusFilter(false);
                                        }}
                                        className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${filters.selectedStatus === 'Unfinished'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                                        Unfinished
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
