import { useState } from 'react';
const TRANSACTIONS_DATA = [
  { id: 1, type: 'card', date: 'Nov 26, 2026', time: '5:00PM', invoice: '#3298', status: 'PAID', amount: 'NGN10,000.00', user: 'Ariyo Oluwamayowa', category: 'Bank Deposit' },
  { id: 2, type: 'reminder', date: 'Nov 26, 2026', time: '3:20PM', invoice: '#3298', status: 'reminder sent', amount: '', user: 'Ajok Fazuk', category: 'Medicine' },
  { id: 3, type: 'card', date: 'Nov 26, 2026', time: '5:00PM', invoice: '#3298', status: 'OVERDUE', amount: 'NGN24,000.00', user: 'Damien Samuel', category: 'Treatment' },
  { id: 4, type: 'bank', date: 'Nov 26, 2026', time: '5:00PM', invoice: '#3298', status: 'PART PAID', amount: 'NGN5,000.00', user: 'Eli', category: 'Electricity' },
  { id: 5, type: 'medicine', date: 'Nov 26, 2026', time: '3:20PM', invoice: '#3298', status: 'PAID', amount: 'NGN300,000.00', user: 'Chima Chukwu', category: 'Medicine' },
  { id: 6, type: 'medical', date: 'Nov 26, 2026', time: '5:00PM', invoice: '#3298', status: 'OVERDUE', amount: 'NGN14,000.00', user: 'Arinze Prince', category: 'Treatment' },
];

export default function AppointmentsLog() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const categories = [
    'All Categories', 'Bank Deposit', 'Transfer from', 'Transfer to', 
    'Electricity', 'Reversal', 'Treatment', 'Medicine'
  ];

  // Helper to style status badges dynamically
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-50 text-green-600 border border-green-200';
      case 'OVERDUE': return 'bg-red-50 text-red-600 border border-red-200';
      case 'PART PAID': return 'bg-blue-50 text-blue-600 border border-blue-200';
      default: return 'text-gray-500 italic';
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen relative">
      
      {/* HEADER TABS & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-200 gap-4">
        <div className="flex gap-6 text-sm font-medium">
          <button className="text-gray-400 pb-2">Calendar</button>
          <button className="text-[#107C41] border-b-2 border-[#107C41] pb-2 font-semibold">Log History</button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 relative self-end sm:self-auto">
          {/* Category Dropdown Button */}
          <div>
            <button 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="px-4 py-2 text-xs md:text-sm bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
            >
              <span className="bg-[#E2F5EC] text-[#107C41] px-1.5 py-0.5 rounded text-[10px] font-bold">
                {activeCategory}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Custom Figma Dropdown Panel */}
            {showCategoryDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-xl p-3 z-20 grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className={`text-left text-xs p-2 rounded-md transition-colors ${
                      activeCategory === cat ? 'bg-[#E2F5EC] text-[#107C41] font-medium' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="px-4 py-2 text-xs md:text-sm bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 text-gray-700">
            <span>All Status</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      {/* RESPONSIVE TABLE / LIST */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                <th className="py-3 px-6 w-16">Type</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Recipient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {TRANSACTIONS_DATA.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => setSelectedTransaction(tx)}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
                >
                  {/* Icon Column */}
                  <td className="py-4 px-6">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:scale-105 transition-transform">
                      {tx.type === 'card' && '💳'}
                      {tx.type === 'reminder' && '📩'}
                      {tx.type === 'bank' && '🏛️'}
                      {tx.type === 'medicine' && '💊'}
                      {tx.type === 'medical' && '⚕️'}
                    </div>
                  </td>
                  {/* Date & Time */}
                  <td className="py-4 px-4 font-medium whitespace-nowrap">
                    {tx.date} <span className="text-xs text-gray-400 ml-2 font-normal">{tx.time}</span>
                  </td>
                  {/* Invoice */}
                  <td className="py-4 px-4 text-gray-400 font-mono text-xs">{tx.invoice}</td>
                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${getStatusStyle(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  {/* Amount */}
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    {tx.amount || '—'}
                  </td>
                  {/* Recipient Profile */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                        {tx.user.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-600 truncate max-w-[120px]">{tx.user}</span>
                      <svg className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION DETAILS OVERLAY (MODAL) */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-all duration-300">
          
          {/* Modal Container */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTransaction(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-center font-bold text-gray-800 text-lg mb-6">Transaction Details</h3>

            {/* Inner Receipt Box */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-5 mb-6 text-center">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Transfer from {selectedTransaction.user.toUpperCase()}</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 mb-1">
                {selectedTransaction.amount || 'NGN0.00'}
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Successful
              </div>
            </div>

            {/* Receipt Table Details */}
            <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-white shadow-inner-sm text-xs">
              <h4 className="font-bold text-gray-700 border-b border-gray-100 pb-2">Transaction Details</h4>
              
              <div className="flex justify-between items-start gap-4">
                <span className="text-gray-400 font-medium">Recipient Details</span>
                <span className="text-right font-semibold text-gray-700 max-w-[200px]">
                  {selectedTransaction.user}<br />
                  <span className="text-[10px] text-gray-400 font-normal">Opay | 7055439868</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Transaction Type</span>
                <span className="font-semibold text-gray-700">Transfer to Bank</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Transaction No.</span>
                <span className="font-mono text-gray-600 flex items-center gap-1">
                  24113245355627778000200143233 
                  <button className="text-emerald-600 hover:text-emerald-700">📋</button>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Payment Method</span>
                <span className="font-semibold text-gray-700">USSD</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Transaction Date</span>
                <span className="font-semibold text-gray-700">{selectedTransaction.date} 08:31:53</span>
              </div>
            </div>

            {/* Action Item */}
            <div className="border border-gray-100 rounded-xl p-4 mt-4 bg-white flex justify-between items-center text-xs">
              <div>
                <p className="text-gray-400 font-medium">More Actions</p>
                <p className="font-semibold text-gray-700 mt-0.5">Choose Category</p>
              </div>
              <span className="text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-200 cursor-pointer flex items-center gap-1">
                {selectedTransaction.category} <span className="text-[10px]">❯</span>
              </span>
            </div>

            {/* Bottom Primary Actions */}
            <div className="flex gap-3 mt-6 pt-2">
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 py-2.5 text-xs md:text-sm font-semibold text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 text-xs md:text-sm font-semibold text-white bg-[#107C41] hover:bg-[#0e6b37] rounded-xl transition-all shadow-sm shadow-emerald-200">
                Share
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
