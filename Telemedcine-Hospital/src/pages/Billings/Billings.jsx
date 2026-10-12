import { useState, useEffect } from 'react'
import {
  Receipt,
  Search,
  Filter,
  Plus,
  CreditCard,
  CheckCircle,
  X,
  Printer,
  Percent,
  Trash2,
  DollarSign
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import api from '../../services/api'

// Initial dummy billing data
const INITIAL_INVOICES = [
  {
    id: 'INV-1001',
    patientName: 'Polly Richardson',
    date: '2026-06-15',
    dueDate: '2026-06-30',
    items: [
      { name: 'Consultation Fee', price: 15000, qty: 1 },
      { name: 'Urinalysis Laboratory Test', price: 20000, qty: 1 },
      { name: 'USG Scan Scan Charge', price: 40000, qty: 1 }
    ],
    discount: 5000,
    tax: 3500,
    total: 73500,
    status: 'Paid',
    paymentMethod: 'Card',
    insuranceProvider: 'None',
    claimId: '',
    claimStatus: 'N/A'
  },
  {
    id: 'INV-1002',
    patientName: 'Akin Yemi',
    date: '2026-06-20',
    dueDate: '2026-07-05',
    items: [
      { name: 'Electrocardiogram (ECG)', price: 45000, qty: 1 },
      { name: 'Cardiology Specialist Fee', price: 35000, qty: 1 },
      { name: 'Atorvastatin Medication', price: 12000, qty: 2 }
    ],
    discount: 0,
    tax: 5200,
    total: 109200,
    status: 'Pending',
    paymentMethod: 'Insurance',
    insuranceProvider: 'AXA Mansard HMO',
    claimId: 'CLM-9081',
    claimStatus: 'Pending'
  },
  {
    id: 'INV-1003',
    patientName: 'Funke Akindele',
    date: '2026-05-10',
    dueDate: '2026-05-25',
    items: [
      { name: 'Emergency Room Admission', price: 50000, qty: 1 },
      { name: 'Saline IV Fluids Infusion', price: 8000, qty: 3 },
      { name: 'Injectable Antibiotics', price: 15000, qty: 1 }
    ],
    discount: 10000,
    tax: 4450,
    total: 83450,
    status: 'Overdue',
    paymentMethod: 'None',
    insuranceProvider: 'Reliance HMO',
    claimId: 'CLM-4211',
    claimStatus: 'Rejected'
  },
  {
    id: 'INV-1004',
    patientName: 'Grace Yinusa',
    date: '2026-06-25',
    dueDate: '2026-07-10',
    items: [
      { name: 'General Outpatient Checkup', price: 10000, qty: 1 },
      { name: 'Paracetamol 500mg (Box)', price: 3000, qty: 2 }
    ],
    discount: 0,
    tax: 800,
    total: 16800,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    insuranceProvider: 'None',
    claimId: '',
    claimStatus: 'N/A'
  }
]

// Revenue Chart Data
const REVENUE_DATA = [
  { month: 'Jan', Billed: 450000, Received: 400000 },
  { month: 'Feb', Billed: 620000, Received: 580000 },
  { month: 'Mar', Billed: 510000, Received: 490000 },
  { month: 'Apr', Billed: 780000, Received: 710000 },
  { month: 'May', Billed: 890000, Received: 790000 },
  { month: 'Jun', Billed: 950000, Received: 860000 }
]

export default function Billings() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('hospital_invoices')
    return saved ? JSON.parse(saved) : INITIAL_INVOICES
  })
  const [summary, setSummary] = useState(null)

  // State controls
  const [activeTab, setActiveTab] = useState('invoices') // 'invoices', 'create', 'charts'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  
  // Payment gateway modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentType, setPaymentType] = useState('Card')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Invoice creation form items builder state
  const [formItems, setFormItems] = useState([{ name: '', price: 0, qty: 1 }])

  // Fetch real invoices and summary from API
  useEffect(() => {
    let isMounted = true

    async function loadBillings() {
      try {
        const [billingsRes, summaryRes] = await Promise.all([
          api.getBillings().catch(() => null),
          api.getBillingSummary().catch(() => null)
        ])

        if (isMounted && billingsRes?.success && billingsRes.data?.length) {
          const mapped = billingsRes.data.map(item => ({
            id: item.invoice_number || `INV-${item.id}`,
            patientName: item.patient_name || 'Akin Yemi',
            date: item.invoice_date || item.created_at || '2026-10-12',
            dueDate: item.due_date || '2026-10-26',
            items: [{ name: item.service_name || 'Medical Service', price: item.total_amount, qty: 1 }],
            discount: 0,
            tax: 0,
            total: item.total_amount || 0,
            status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : 'Pending',
            paymentMethod: item.payment_method || 'Card',
            insuranceProvider: 'None',
            claimId: '',
            claimStatus: 'N/A'
          }))
          setInvoices(mapped)
        }

        if (isMounted && summaryRes?.success && summaryRes.data) {
          setSummary(summaryRes.data)
        }
      } catch (err) {
        console.warn('Billings fetch note:', err.message)
      }
    }

    loadBillings()
    return () => { isMounted = false }
  }, [])

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('hospital_invoices', JSON.stringify(invoices))
  }, [invoices])

  // Calculation metrics
  const totalBilled = summary?.total_revenue ?? invoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalReceived = summary?.total_paid ?? invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)
  const totalOutstanding = summary ? (summary.total_pending + summary.total_overdue) : invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.total, 0)
  const claimApprovalsCount = invoices.filter(inv => inv.claimStatus === 'Approved').length
  const totalClaimsCount = invoices.filter(inv => inv.paymentMethod === 'Insurance').length
  const claimApprovalRate = totalClaimsCount > 0 ? Math.round((claimApprovalsCount / totalClaimsCount) * 100) : 0

  // Filter logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Create Invoice Form handlers
  const handleAddItemRow = () => {
    setFormItems([...formItems, { name: '', price: 0, qty: 1 }])
  }

  const handleRemoveItemRow = (idx) => {
    if (formItems.length === 1) return
    setFormItems(formItems.filter((_, i) => i !== idx))
  }

  const handleItemRowChange = (idx, field, val) => {
    setFormItems(
      formItems.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            [field]: field === 'name' ? val : parseFloat(val || '0')
          }
        }
        return item
      })
    )
  }

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    // Calculate invoice financials
    const subtotal = formItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const discount = parseFloat(formData.get('discount') || '0')
    const tax = parseFloat(formData.get('tax') || '0')
    const total = subtotal - discount + tax

    const payMethod = formData.get('paymentMethod')
    const insProvider = formData.get('insuranceProvider') || 'None'
    const dueDate = formData.get('dueDate') || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    const serviceName = formItems[0]?.name || 'Clinical Care'

    // Attempt backend API create
    let serverInvoiceNumber = `INV-${Date.now().toString().slice(-4)}`
    try {
      const createdRes = await api.createInvoice({
        patient_id: 1,
        service_name: serviceName,
        total_amount: total,
        payment_method: payMethod,
        due_date: dueDate
      })
      if (createdRes?.invoiceNumber) {
        serverInvoiceNumber = createdRes.invoiceNumber
      }
    } catch (err) {
      console.warn('Backend invoice create note:', err.message)
    }

    const newInvoice = {
      id: serverInvoiceNumber,
      patientName: formData.get('patientName') || 'Akin Yemi',
      date: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      items: formItems,
      discount,
      tax,
      total,
      status: payMethod === 'Insurance' ? 'Pending' : 'Pending',
      paymentMethod: payMethod,
      insuranceProvider: payMethod === 'Insurance' ? insProvider : 'None',
      claimId: payMethod === 'Insurance' ? `CLM-${Math.floor(1000 + Math.random() * 9000)}` : '',
      claimStatus: payMethod === 'Insurance' ? 'Pending' : 'N/A'
    }

    setInvoices([newInvoice, ...invoices])
    setFormItems([{ name: '', price: 0, qty: 1 }])
    setActiveTab('invoices')
  }

  // Payment process simulation
  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    setPaymentSuccess(true)
    setTimeout(() => {
      const updated = invoices.map(inv => {
        if (inv.id === selectedInvoice.id) {
          return {
            ...inv,
            status: 'Paid',
            paymentMethod: paymentType
          }
        }
        return inv
      })
      setInvoices(updated)
      setSelectedInvoice({
        ...selectedInvoice,
        status: 'Paid',
        paymentMethod: paymentType
      })
      setPaymentSuccess(false)
      setShowPaymentModal(false)
    }, 1500)
  }

  // Claim actions simulation
  const handleProcessClaim = (invoiceId, action) => {
    const updated = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          claimStatus: action,
          status: action === 'Approved' ? 'Paid' : 'Overdue'
        }
      }
      return inv
    })
    setInvoices(updated)
    if (selectedInvoice?.id === invoiceId) {
      setSelectedInvoice({
        ...selectedInvoice,
        claimStatus: action,
        status: action === 'Approved' ? 'Paid' : 'Overdue'
      })
    }
  }

  // Trigger invoice refund
  const handleTriggerRefund = (invoiceId) => {
    if (window.confirm('Are you sure you want to refund this payment?')) {
      const updated = invoices.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Refunded'
          }
        }
        return inv
      })
      setInvoices(updated)
      if (selectedInvoice?.id === invoiceId) {
        setSelectedInvoice({
          ...selectedInvoice,
          status: 'Refunded'
        })
      }
    }
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen w-full font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hospital Billing & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient bills, log procedure invoicing, check claims, and process payments.</p>
        </div>
        <button
          onClick={() => setActiveTab(activeTab === 'create' ? 'invoices' : 'create')}
          className="flex items-center gap-2 bg-[#10AD69] hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>{activeTab === 'create' ? 'View Invoices' : 'Create Invoice'}</span>
        </button>
      </div>

      {/* ── FINANCIAL OVERVIEW METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Billed', val: `NGN ${totalBilled.toLocaleString()}`, trend: 'Gross invoiced', color: 'border-l-blue-500' },
          { label: 'Payments Received', val: `NGN ${totalReceived.toLocaleString()}`, trend: 'Collected cash', color: 'border-l-emerald-500' },
          { label: 'Outstanding Balance', val: `NGN ${totalOutstanding.toLocaleString()}`, trend: 'Uncollected debt', color: 'border-l-rose-500' },
          { label: 'Claim Approval Rate', val: `${claimApprovalRate}%`, trend: 'Insurance clearance', color: 'border-l-amber-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${stat.color} p-5 shadow-2xs`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 block">{stat.val}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 mb-6 flex gap-2 overflow-x-auto shadow-2xs no-scrollbar">
        {[
          { id: 'invoices', label: 'Patient Bills Ledger' },
          { id: 'charts', label: 'Revenue & Collection Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-100 text-slate-950 shadow-inner-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COMPONENT COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: LEDGER */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              
              {/* Filters Block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row gap-4 shadow-2xs">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search invoice number, patient name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm focus:outline-none focus:border-[#10AD69]"
                  />
                </div>
                
                <div className="flex gap-2 items-center">
                  <Filter size={16} className="text-slate-400 shrink-0" />
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar max-w-[280px] sm:max-w-md">
                    {['All', 'Paid', 'Pending', 'Overdue', 'Refunded'].map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedStatus === status
                            ? 'bg-[#E2F5ED] text-[#10AD69]'
                            : 'bg-[#F8FAFC] text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bills Table Card */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                        <th className="px-5 py-4">Invoice ID</th>
                        <th className="px-5 py-4">Patient</th>
                        <th className="px-5 py-4">Bill Date</th>
                        <th className="px-5 py-4">Due Date</th>
                        <th className="px-5 py-4 text-right">Total</th>
                        <th className="px-5 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-5 py-12 text-center text-slate-400 text-sm">
                            No matching invoices or bills recorded.
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map(inv => (
                          <tr
                            key={inv.id}
                            onClick={() => setSelectedInvoice(inv)}
                            className={`hover:bg-slate-50/60 cursor-pointer transition-colors ${
                              selectedInvoice?.id === inv.id ? 'bg-[#E2F5ED]/20' : ''
                            }`}
                          >
                            <td className="px-5 py-4 text-xs font-bold text-slate-900">{inv.id}</td>
                            <td className="px-5 py-4 text-sm font-semibold text-slate-800">{inv.patientName}</td>
                            <td className="px-5 py-4 text-xs text-slate-500">{inv.date}</td>
                            <td className="px-5 py-4 text-xs text-slate-500">{inv.dueDate}</td>
                            <td className="px-5 py-4 text-sm font-extrabold text-slate-900 text-right">
                              NGN {inv.total.toLocaleString()}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                                inv.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                inv.status === 'Refunded' ? 'bg-blue-50 text-blue-700' :
                                'bg-rose-50 text-rose-700'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE INVOICE FORM */}
          {activeTab === 'create' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-4 font-serif">Create New Invoice</h3>
              
              <form onSubmit={handleCreateInvoiceSubmit} className="space-y-6">
                
                {/* Patient / Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Patient Name</label>
                    <input
                      type="text"
                      name="patientName"
                      required
                      placeholder="e.g. Akin Yemi"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      required
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                    />
                  </div>
                </div>

                {/* Dynamic Items Builder */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Billable Items / Procedures</span>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="text-xs font-bold text-[#10AD69] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>

                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) => handleItemRowChange(idx, 'name', e.target.value)}
                          placeholder="Description (e.g. ECG, Doctor Consultation)"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          required
                          value={item.price || ''}
                          onChange={(e) => handleItemRowChange(idx, 'price', e.target.value)}
                          placeholder="Price"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          required
                          value={item.qty || ''}
                          onChange={(e) => handleItemRowChange(idx, 'qty', e.target.value)}
                          placeholder="Qty"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-center focus:outline-none focus:border-[#10AD69]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={formItems.length === 1}
                        className="text-slate-400 hover:text-red-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pricing adjustments & Payments options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Billing Routing / Payment Type</label>
                      <select
                        name="paymentMethod"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#10AD69]"
                      >
                        <option value="Card">Direct Payment Gateway (Card/Transfer)</option>
                        <option value="Insurance">HMO / Insurance Provider Claim</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Insurance HMO Provider (Optional)</label>
                      <input
                        type="text"
                        name="insuranceProvider"
                        placeholder="e.g. AXA Mansard, Reliance HMO"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#10AD69]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                      <span>Subtotal</span>
                      <span>NGN {formItems.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-semibold flex-1">Discount Amount</span>
                      <div className="relative w-28">
                        <input
                          type="number"
                          name="discount"
                          defaultValue="0"
                          className="w-full border border-slate-200 rounded-xl pl-6 pr-3 py-1 text-xs text-right focus:outline-none"
                        />
                        <Percent size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-b border-slate-200/50 pb-2">
                      <span className="text-xs text-slate-500 font-semibold flex-1">VAT Tax (7.5%)</span>
                      <div className="relative w-28">
                        <input
                          type="number"
                          name="tax"
                          defaultValue="0"
                          className="w-full border border-slate-200 rounded-xl pl-6 pr-3 py-1 text-xs text-right focus:outline-none"
                        />
                        <DollarSign size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center font-bold text-sm text-slate-900 pt-1">
                      <span>Total Invoice Due</span>
                      <span>
                        NGN {(
                          formItems.reduce((sum, item) => sum + item.price * item.qty, 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Create and Route Invoice
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: CHARTS */}
          {activeTab === 'charts' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-4 font-serif">Invoiced vs Received Revenue</h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10AD69" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10AD69" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Billed" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorBilled)" />
                    <Area type="monotone" dataKey="Received" stroke="#10AD69" strokeWidth={2} fillOpacity={1} fill="url(#colorReceived)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center items-center gap-6 mt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
                  <span>Total Billed Amount</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#10AD69]" />
                  <span>Cash Payments Collected</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT INVOICE PREVIEW COLUMN (1/3 width) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs flex flex-col justify-between min-h-[420px]">
            {selectedInvoice ? (
              <div className="space-y-4">
                
                {/* Preview Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{selectedInvoice.id}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">{selectedInvoice.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedInvoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                    selectedInvoice.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    selectedInvoice.status === 'Refunded' ? 'bg-blue-50 text-blue-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>

                {/* Patient detail block */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient</span>
                  <span className="text-base font-bold text-slate-800 leading-snug">{selectedInvoice.patientName}</span>
                  {selectedInvoice.paymentMethod === 'Insurance' && (
                    <div className="mt-2 bg-[#F8FAFC] border border-slate-100 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-400">HMO:</span>
                        <span className="text-slate-700 font-semibold">{selectedInvoice.insuranceProvider}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-400">Claim ID:</span>
                        <span className="text-slate-700">{selectedInvoice.claimId}</span>
                      </div>
                      <div className="flex justify-between items-center font-medium pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Claim Status:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          selectedInvoice.claimStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          selectedInvoice.claimStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedInvoice.claimStatus}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Invoice Items list */}
                <div className="space-y-2 border-t border-dashed border-slate-100 pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bill Particulars</span>
                  {selectedInvoice.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                      <span className="text-slate-900 font-bold">NGN {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Financial overview breakdown */}
                <div className="space-y-1.5 border-t border-dashed border-slate-100 pt-3 text-xs text-slate-500 font-medium">
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-emerald-600 font-semibold">- NGN {selectedInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedInvoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span>VAT (7.5%)</span>
                      <span>+ NGN {selectedInvoice.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 pt-1 text-sm border-t border-slate-100">
                    <span>Amount Due</span>
                    <span>NGN {selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action buttons (Print, Pay, Claim processing, Refund) */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 flex justify-center items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2 rounded-xl text-xs cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print Receipt</span>
                  </button>
                  {selectedInvoice.status !== 'Paid' && selectedInvoice.paymentMethod !== 'Insurance' && (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="flex-1 bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Process Payment
                    </button>
                  )}
                </div>

                {selectedInvoice.paymentMethod === 'Insurance' && selectedInvoice.claimStatus === 'Pending' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleProcessClaim(selectedInvoice.id, 'Approved')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Approve HMO Claim
                    </button>
                    <button
                      onClick={() => handleProcessClaim(selectedInvoice.id, 'Rejected')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Reject HMO Claim
                    </button>
                  </div>
                )}

                {selectedInvoice.status === 'Paid' && (
                  <button
                    onClick={() => handleTriggerRefund(selectedInvoice.id)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-rose-600 font-bold py-2 rounded-xl text-xs border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                  >
                    Trigger Refund
                  </button>
                )}

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <Receipt size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Select an Invoice</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Click any record in the ledger table to trigger preview, print, or payments.</p>
              </div>
            )}
          </div>

          {/* Quick Notice info */}
          <div className="bg-slate-100 rounded-3xl p-6 relative overflow-hidden min-h-[150px] flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">HMO Billing Clearances</h3>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium mt-2">
                HMO clearings require complete authorization signatures before dispatch. Verify patient policy ID digits correctly in files to avoid claims denials.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ── PAYMENT GATEWAY MODAL ── */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 mb-4 font-serif">Checkout Terminal</h3>
            <p className="text-xs text-slate-400 mb-4">Invoice ID: {selectedInvoice.id} • Payable Amount: <strong>NGN {selectedInvoice.total.toLocaleString()}</strong></p>

            <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl mb-4">
              {['Card', 'Bank Transfer'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPaymentType(type)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                    paymentType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentType === 'Card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akin Yemi"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="•••• •••• •••• ••••"
                        className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                      />
                      <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-center focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CVC Code</label>
                      <input
                        type="password"
                        required
                        maxLength="3"
                        placeholder="•••"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 text-xs space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Beneficiary Bank:</span>
                    <span className="font-semibold text-slate-700">Access Bank PLC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <span className="font-bold text-slate-800 tracking-wider">0821990421</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Name:</span>
                    <span className="font-semibold text-slate-700">Medicare Systems Nigeria Ltd</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center border-t border-slate-200/50 pt-2 font-medium">Please transfer the exact sum of NGN {selectedInvoice.total.toLocaleString()} and click submit below to simulate approval.</p>
                </div>
              )}

              {paymentSuccess ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 border border-emerald-100 rounded-xl py-3 animate-pulse">
                  <CheckCircle size={18} />
                  <span>Processing Payment Clearing...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Pay Invoice
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Styled custom scrollbars configuration */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  )
}
