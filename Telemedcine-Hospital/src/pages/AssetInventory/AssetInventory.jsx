import { useState, useEffect } from 'react'
import {
  PackageSearch,
  Search,
  Filter,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Wrench,
  UserCheck,
  Barcode,
  QrCode,
  Download,
  X,
  Trash2,
  Boxes
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import api from '../../services/api'

// Initial dummy inventory data
const INITIAL_ITEMS = [
  {
    id: 'INV-M101',
    name: 'Insulin Glargine 100 U/mL',
    category: 'Medicines',
    stock: 12,
    threshold: 20,
    unit: 'Vials',
    expiryDate: '2026-09-10',
    supplier: 'Novartis Pharma',
    assignedTo: 'Pharmacy Depot',
    maintenanceDate: 'N/A',
    maintenanceStatus: 'N/A'
  },
  {
    id: 'INV-E201',
    name: 'ICU Ventilator Medtronic-840',
    category: 'Medical Equipment',
    stock: 8,
    threshold: 2,
    unit: 'Units',
    expiryDate: 'N/A',
    supplier: 'Medtronic Nigeria',
    assignedTo: 'Intensive Care Unit (ICU)',
    maintenanceDate: '2026-07-20',
    maintenanceStatus: 'Scheduled'
  },
  {
    id: 'INV-S301',
    name: 'Sterile Disposable Syringes 5mL',
    category: 'Supplies',
    stock: 550,
    threshold: 100,
    unit: 'Boxes (100pcs)',
    expiryDate: '2029-12-01',
    supplier: 'Becton Dickinson Ltd',
    assignedTo: 'Main Clinic Ward',
    maintenanceDate: 'N/A',
    maintenanceStatus: 'N/A'
  },
  {
    id: 'INV-M102',
    name: 'Paracetamol Infusion 1g/100mL',
    category: 'Medicines',
    stock: 4,
    threshold: 50,
    unit: 'Bottles',
    expiryDate: '2026-05-15', // Expired
    supplier: 'Emzor Pharmaceuticals',
    assignedTo: 'Emergency Ward',
    maintenanceDate: 'N/A',
    maintenanceStatus: 'N/A'
  },
  {
    id: 'INV-E202',
    name: 'Defibrillator HeartStart XL',
    category: 'Medical Equipment',
    stock: 3,
    threshold: 2,
    unit: 'Units',
    expiryDate: 'N/A',
    supplier: 'Philips Healthcare',
    assignedTo: 'Emergency Ward',
    maintenanceDate: '2026-06-10',
    maintenanceStatus: 'Completed'
  }
]

const SUPPLIERS = [
  'Novartis Pharma',
  'Medtronic Nigeria',
  'Becton Dickinson Ltd',
  'Emzor Pharmaceuticals',
  'Philips Healthcare',
  'Roche Diagnostics'
]

const CATEGORIES = ['All', 'Medical Equipment', 'Medicines', 'Supplies']

export default function AssetInventory() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('hospital_inventory')
    return saved ? JSON.parse(saved) : INITIAL_ITEMS
  })

  // State controls
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory', 'po', 'transactions', 'maintenance'
  const [selectedSubTab, setSelectedSubTab] = useState('All') // 'All', 'Medical Equipment', 'Medicines', 'Supplies'
  const [searchQuery, setSearchQuery] = useState('')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  const [showExpiredOnly, setShowExpiredOnly] = useState(false)
  
  // Modals state
  const [selectedItem, setSelectedItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showStockAdjustModal, setShowStockAdjustModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  
  // Transactions log state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('inventory_transactions')
    return saved ? JSON.parse(saved) : [
      { id: 'TX-101', date: '2026-06-25', itemId: 'INV-M101', itemName: 'Insulin Glargine', qty: 10, type: 'Stock In', note: 'Monthly restock' },
      { id: 'TX-102', date: '2026-06-28', itemId: 'INV-S301', itemName: 'Sterile Disposable Syringes 5mL', qty: 50, type: 'Stock Out', note: 'Issued to Pediatric Clinic' }
    ]
  })

  // Purchase orders list state
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('inventory_po')
    return saved ? JSON.parse(saved) : [
      { id: 'PO-901', date: '2026-06-20', supplier: 'Medtronic Nigeria', totalItems: 2, status: 'Received' },
      { id: 'PO-902', date: '2026-06-27', supplier: 'Novartis Pharma', totalItems: 5, status: 'Sent' }
    ]
  })

  // PO creation builder items state
  const [poBuilderItems, setPoBuilderItems] = useState([{ name: '', qty: 1 }])

  // Fetch real items from backend API
  useEffect(() => {
    let isMounted = true

    async function loadInventory() {
      try {
        const res = await api.getInventory().catch(() => null)
        if (isMounted && res?.success && res.data?.length) {
          const mapped = res.data.map(item => ({
            id: `INV-${item.id}`,
            apiId: item.id,
            name: item.item_name,
            category: item.category || 'Supplies',
            stock: item.quantity,
            threshold: item.reorder_level || 10,
            unit: item.unit || 'Units',
            expiryDate: '2028-12-31',
            supplier: item.location || 'Hospital Pharmacy',
            assignedTo: item.location || 'Central Depot',
            maintenanceDate: 'N/A',
            maintenanceStatus: item.status === 'LOW_STOCK' ? 'Low Stock' : 'Optimal'
          }))
          setItems(mapped)
        }
      } catch (err) {
        console.warn('Inventory fetch note:', err.message)
      }
    }

    loadInventory()
    return () => { isMounted = false }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hospital_inventory', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('inventory_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('inventory_po', JSON.stringify(purchaseOrders))
  }, [purchaseOrders])

  // Stats calculation
  const totalItemsCount = items.length
  const lowStockCount = items.filter(i => i.stock <= i.threshold).length
  
  const todayStr = new Date().toISOString().split('T')[0]
  const expiredCount = items.filter(i => i.expiryDate !== 'N/A' && i.expiryDate < todayStr).length
  const maintenanceCount = items.filter(i => i.maintenanceStatus === 'Scheduled').length

  // Recharts Stock Category distribution details
  const pieData = CATEGORIES.slice(1).map(cat => {
    const catItems = items.filter(i => i.category === cat)
    const totalStockVal = catItems.reduce((sum, item) => sum + (item.stock > 0 ? item.stock : 0), 0)
    return { name: cat, value: totalStockVal }
  })

  // Filtering Logic
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = selectedSubTab === 'All' || item.category === selectedSubTab
    
    // Quick toggles
    const isLowStock = item.stock <= item.threshold
    const isExpired = item.expiryDate !== 'N/A' && item.expiryDate < todayStr
    
    const matchesLowStock = !showLowStockOnly || isLowStock
    const matchesExpired = !showExpiredOnly || isExpired

    return matchesSearch && matchesTab && matchesLowStock && matchesExpired
  })

  // CRUD & Stock Actions handlers
  const handleAddItem = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const cat = formData.get('category')
    
    // Generate simple ID base
    const prefix = cat === 'Medicines' ? 'INV-M' : cat === 'Medical Equipment' ? 'INV-E' : 'INV-S'
    const newId = `${prefix}${Math.floor(100 + Math.random() * 900)}`

    const newItem = {
      id: newId,
      name: formData.get('name'),
      category: cat,
      stock: parseInt(formData.get('stock') || '0'),
      threshold: parseInt(formData.get('threshold') || '10'),
      unit: formData.get('unit'),
      expiryDate: formData.get('expiryDate') || 'N/A',
      supplier: formData.get('supplier'),
      assignedTo: 'Warehouse Depot',
      maintenanceDate: cat === 'Medical Equipment' ? formData.get('maintenanceDate') || 'N/A' : 'N/A',
      maintenanceStatus: cat === 'Medical Equipment' ? 'Completed' : 'N/A'
    }

    setItems([newItem, ...items])
    setShowAddModal(false)
  }

  // Stock In / Out Adjustment Trigger
  const handleStockAdjustSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const adjQty = parseInt(formData.get('qty') || '0')
    const adjType = formData.get('type') // 'Stock In' or 'Stock Out'
    const note = formData.get('note')

    const nextStock = adjType === 'Stock In' ? selectedItem.stock + adjQty : Math.max(0, selectedItem.stock - adjQty)

    // Sync to backend API
    const targetApiId = selectedItem.apiId || (parseInt(selectedItem.id.replace(/\D/g, '')) || 1)
    api.updateStock(targetApiId, nextStock).catch(err => {
      console.warn('Backend stock update note:', err.message)
    })

    const updated = items.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          stock: nextStock
        }
      }
      return item
    })

    setItems(updated)
    setSelectedItem({
      ...selectedItem,
      stock: nextStock
    })

    // Log transaction
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: todayStr,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      qty: adjQty,
      type: adjType,
      note
    }
    setTransactions([newTx, ...transactions])
    setShowStockAdjustModal(false)
  }

  // Assign Equipment Submit
  const handleAssignSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const assignee = formData.get('assignedTo')

    const updated = items.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, assignedTo: assignee }
      }
      return item
    })
    setItems(updated)
    setSelectedItem({ ...selectedItem, assignedTo: assignee })
    setShowAssignModal(false)
  }

  // Maintenance Submit
  const handleMaintenanceSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const mDate = formData.get('maintenanceDate')
    const mStatus = formData.get('maintenanceStatus')

    const updated = items.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          maintenanceDate: mDate,
          maintenanceStatus: mStatus
        }
      }
      return item
    })
    setItems(updated)
    setSelectedItem({
      ...selectedItem,
      maintenanceDate: mDate,
      maintenanceStatus: mStatus
    })
    setShowMaintenanceModal(false)
  }

  // Purchase Order builders
  const handlePoBuilderAddRow = () => {
    setPoBuilderItems([...poBuilderItems, { name: '', qty: 1 }])
  }

  const handlePoBuilderRemoveRow = (idx) => {
    if (poBuilderItems.length === 1) return
    setPoBuilderItems(poBuilderItems.filter((_, i) => i !== idx))
  }

  const handlePoBuilderRowChange = (idx, field, val) => {
    setPoBuilderItems(
      poBuilderItems.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            [field]: field === 'name' ? val : parseInt(val || '1')
          }
        }
        return item
      })
    )
  }

  const handlePoSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const totalItems = poBuilderItems.length

    const newPo = {
      id: `PO-${Math.floor(100 + Math.random() * 900)}`,
      date: todayStr,
      supplier: formData.get('supplier'),
      totalItems,
      status: 'Sent'
    }

    setPurchaseOrders([newPo, ...purchaseOrders])
    setPoBuilderItems([{ name: '', qty: 1 }])
    alert('Purchase Order Created and sent successfully!')
  }

  // Export actions
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Item ID,Name,Category,Stock Level,Safety Threshold,Unit,Expiry Date,Supplier,Assigned Depot']
        .concat(
          items.map(
            i =>
              `"${i.id}","${i.name.replace(/"/g, '""')}","${i.category}",${i.stock},${i.threshold},"${i.unit}","${i.expiryDate}","${i.supplier.replace(/"/g, '""')}","${i.assignedTo.replace(/"/g, '""')}"`
          )
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'hospital_inventory.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen w-full font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hospital Assets & Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Audit clinical machines, supplies stockpiles, expiry tracking, and purchase orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm shadow-xs cursor-pointer transition-colors"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#10AD69] hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Asset Item</span>
          </button>
        </div>
      </div>

      {/* ── INVENTORY OVERVIEW STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Catalog Items', val: totalItemsCount, desc: 'Stock types', color: 'border-l-blue-500' },
          { label: 'Low Stock Alerts', val: lowStockCount, desc: 'Below safety threshold', color: 'border-l-rose-500', alert: lowStockCount > 0 },
          { label: 'Expired Batches', val: expiredCount, desc: 'Critical action needed', color: 'border-l-red-500', alert: expiredCount > 0 },
          { label: 'Scheduled Maintenance', val: maintenanceCount, desc: 'Equipment service logs', color: 'border-l-amber-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${stat.color} p-5 shadow-2xs relative`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 block">{stat.val}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">{stat.desc}</span>
            {stat.alert && (
              <span className="absolute top-4 right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── MODULE LEVEL TABS ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 mb-6 flex gap-2 overflow-x-auto shadow-2xs no-scrollbar">
        {[
          { id: 'inventory', label: 'Inventory Ledger' },
          { id: 'po', label: 'Purchase Orders (PO)' },
          { id: 'transactions', label: 'Transaction Audit Log' }
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

      {/* ── MAIN CONTENTS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT MAIN MODULE CONTAINER (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: INVENTORY CATALOG */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              
              {/* Controls bar */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-4 shadow-2xs">
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search assets, items by ID or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#10AD69]"
                    />
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <Filter size={16} className="text-slate-400 shrink-0" />
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar max-w-[280px]">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedSubTab(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            selectedSubTab === cat
                              ? 'bg-[#E2F5ED] text-[#10AD69]'
                              : 'bg-[#F8FAFC] text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter switches for Low Stock & Expired */}
                <div className="flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600 font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showLowStockOnly}
                      onChange={(e) => setShowLowStockOnly(e.target.checked)}
                      className="rounded border-slate-200 text-[#10AD69] focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <span>Show Critical Low Stock Only</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showExpiredOnly}
                      onChange={(e) => setShowExpiredOnly(e.target.checked)}
                      className="rounded border-slate-200 text-[#10AD69] focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <span className="text-red-500">Show Expired Batches Only</span>
                  </label>
                </div>

              </div>

              {/* Inventory table */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                        <th className="px-5 py-4">Item ID</th>
                        <th className="px-5 py-4">Item Name</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4 text-right">Stock Level</th>
                        <th className="px-5 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-5 py-12 text-center text-slate-400 text-xs">
                            No assets or items match your selection criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map(item => {
                          const isLow = item.stock <= item.threshold
                          const isExp = item.expiryDate !== 'N/A' && item.expiryDate < todayStr
                          
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                                selectedItem?.id === item.id ? 'bg-[#E2F5ED]/20' : ''
                              }`}
                            >
                              <td className="px-5 py-4 text-xs font-bold text-slate-900">{item.id}</td>
                              <td className="px-5 py-4 font-semibold text-slate-800">
                                <div>
                                  <p>{item.name}</p>
                                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{item.supplier}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-500 font-medium">{item.category}</td>
                              <td className="px-5 py-4 text-right font-extrabold text-slate-950">
                                <span>{item.stock}</span> <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
                              </td>
                              <td className="px-5 py-4 text-center">
                                {isExp ? (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">Expired</span>
                                ) : isLow ? (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">Low Stock</span>
                                ) : (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">In Stock</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PURCHASE ORDERS */}
          {activeTab === 'po' && (
            <div className="space-y-6">
              
              {/* Create Purchase Order */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
                <h3 className="font-bold text-slate-800 text-lg mb-4 font-serif">Issue Purchase Order (PO)</h3>
                
                <form onSubmit={handlePoSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Supplier</label>
                      <select
                        name="supplier"
                        required
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                      >
                        {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Requested Items</span>
                      <button
                        type="button"
                        onClick={handlePoBuilderAddRow}
                        className="text-xs font-bold text-[#10AD69] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Row
                      </button>
                    </div>

                    {poBuilderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => handlePoBuilderRowChange(idx, 'name', e.target.value)}
                            placeholder="Item description / specification"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            required
                            value={item.qty}
                            onChange={(e) => handlePoBuilderRowChange(idx, 'qty', e.target.value)}
                            placeholder="Qty"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-center focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePoBuilderRemoveRow(idx)}
                          disabled={poBuilderItems.length === 1}
                          className="text-slate-400 hover:text-red-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    Generate & Send PO
                  </button>
                </form>
              </div>

              {/* Purchase Orders List */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Pending and Past Purchase Orders</h3>
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                        <th className="px-4 py-3">PO Number</th>
                        <th className="px-4 py-3">Supplier</th>
                        <th className="px-4 py-3">Order Date</th>
                        <th className="px-4 py-3 text-center">Items Count</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {purchaseOrders.map(po => (
                        <tr key={po.id} className="hover:bg-slate-50/40">
                          <td className="px-4 py-3 font-bold text-slate-900">{po.id}</td>
                          <td className="px-4 py-3 font-semibold text-slate-700">{po.supplier}</td>
                          <td className="px-4 py-3 text-slate-400">{po.date}</td>
                          <td className="px-4 py-3 text-center font-bold">{po.totalItems}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              po.status === 'Received' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                            }`}>
                              {po.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TRANSACTION AUDIT LOG */}
          {activeTab === 'transactions' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-4 font-serif">Stock Adjustments Log</h3>
              
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                      <th className="px-4 py-3">TX Code</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3 text-right">Adjustment</th>
                      <th className="px-4 py-3">Description Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-900">{tx.id}</td>
                        <td className="px-4 py-3 text-slate-400">{tx.date}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          <div>
                            <p>{tx.itemName}</p>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{tx.itemId}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-bold ${
                            tx.type === 'Stock In' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {tx.type === 'Stock In' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                            {tx.qty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-medium">{tx.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ITEM VIEW & SUB-ACTIONS (1/3 width) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs min-h-[380px] flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-5">
                
                {/* Item Details Header */}
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500">
                    {selectedItem.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{selectedItem.id}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug">{selectedItem.name}</h3>
                  <span className="text-xs text-slate-400 block mt-1">Supplier: {selectedItem.supplier}</span>
                </div>

                {/* Expiry / Assignment Details */}
                <div className="space-y-3 bg-[#F8FAFC] p-3 rounded-2xl text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Stock Count:</span>
                    <span className="text-slate-800 font-bold">{selectedItem.stock} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Safety Limit:</span>
                    <span className="text-slate-500">{selectedItem.threshold} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Depot/Ward:</span>
                    <span className="text-[#10AD69] font-bold">{selectedItem.assignedTo}</span>
                  </div>
                  {selectedItem.expiryDate !== 'N/A' && (
                    <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-red-500">
                      <span>Expiry Date:</span>
                      <span>{selectedItem.expiryDate}</span>
                    </div>
                  )}
                  {selectedItem.category === 'Medical Equipment' && (
                    <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                      <span className="text-slate-400">Next Service:</span>
                      <span className="text-slate-600">{selectedItem.maintenanceDate} ({selectedItem.maintenanceStatus})</span>
                    </div>
                  )}
                </div>

                {/* Barcode/QR simulation box */}
                <div className="border border-slate-100 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-2xs">
                  <div className="flex gap-2">
                    <Barcode size={36} className="text-slate-800" />
                    <QrCode size={36} className="text-slate-800" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-widest">{selectedItem.id}-AUDIT</span>
                </div>

                {/* Trigger Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setShowStockAdjustModal(true)}
                    className="flex flex-col items-center justify-center gap-1 border border-slate-200 hover:bg-[#E2F5ED] hover:border-emerald-200 text-slate-600 hover:text-[#10AD69] py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Boxes size={14} />
                    <span>Adjust Stock</span>
                  </button>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex flex-col items-center justify-center gap-1 border border-slate-200 hover:bg-[#E2F5ED] hover:border-emerald-200 text-slate-600 hover:text-[#10AD69] py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <UserCheck size={14} />
                    <span>Assign Ward</span>
                  </button>
                  <button
                    onClick={() => {
                      if (selectedItem.category !== 'Medical Equipment') {
                        alert('Maintenance scheduling is only applicable for Medical Equipment assets.')
                        return
                      }
                      setShowMaintenanceModal(true)
                    }}
                    className="flex flex-col items-center justify-center gap-1 border border-slate-200 hover:bg-[#E2F5ED] hover:border-emerald-200 text-slate-600 hover:text-[#10AD69] py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Wrench size={14} />
                    <span>Maintenance</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <PackageSearch size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Select an Asset</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Click any catalog row to check details, visual barcodes, ward logs, and stock in/out adjustments.</p>
              </div>
            )}
          </div>

          {/* Pie Chart display of stocks */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs flex flex-col justify-between min-h-[220px]">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">Stock Distribution</h3>
            <div className="flex items-center justify-start gap-4">
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {pieData.map((entry, index) => {
                      const colors = ['#6366F1', '#10AD69', '#EAB308']
                      return <Cell key={index} fill={colors[index % colors.length]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 font-semibold">
                {pieData.map((e, i) => {
                  const colors = ['bg-[#6366F1]', 'bg-[#10AD69]', 'bg-[#EAB308]']
                  return (
                    <div key={e.name} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[i % colors.length]}`} />
                      <span>{e.name}: <strong>{e.value}</strong></span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── ADD ASSET ITEM MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 mb-4 font-serif">Add Asset to Inventory</h3>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Asset/Item Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. ECG Electrode Gel, Pulse Oximeter"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Supplier</label>
                  <select
                    name="supplier"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    defaultValue="50"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Threshold</label>
                  <input
                    type="number"
                    name="threshold"
                    required
                    defaultValue="10"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    required
                    defaultValue="Boxes"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-center focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date (Medicines/Supplies)</label>
                <input
                  type="date"
                  name="expiryDate"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Maintenance Date (Equipment Only)</label>
                <input
                  type="date"
                  name="maintenanceDate"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Save Asset Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STOCK ADJUST MODAL ── */}
      {showStockAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowStockAdjustModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-base text-slate-800 mb-4 font-serif">Adjust Stock - {selectedItem.name}</h3>
            
            <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
                {['Stock In', 'Stock Out'].map(type => (
                  <label
                    key={type}
                    className="flex-1"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      defaultChecked={type === 'Stock In'}
                      className="sr-only peer"
                    />
                    <div className="py-2 text-xs font-bold text-center rounded-lg cursor-pointer transition-colors peer-checked:bg-[#10AD69] peer-checked:text-white text-slate-500">
                      {type}
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Adjustment Quantity</label>
                <input
                  type="number"
                  name="qty"
                  required
                  placeholder="e.g. 10"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Reason/Note</label>
                <input
                  type="text"
                  name="note"
                  required
                  placeholder="e.g. Issued to Clinic A, Received delivery"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Save Stock Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ASSIGN MODAL ── */}
      {showAssignModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-base text-slate-800 mb-4 font-serif">Assign Asset - {selectedItem.name}</h3>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Assign to Ward / Department / Practitioner</label>
                <input
                  type="text"
                  name="assignedTo"
                  required
                  defaultValue={selectedItem.assignedTo}
                  placeholder="e.g. Pediatrics Ward B, Dr. Helen Vance"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10AD69]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Confirm Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MAINTENANCE MODAL ── */}
      {showMaintenanceModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowMaintenanceModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-base text-slate-800 mb-4 font-serif">Asset Maintenance Logs</h3>
            <p className="text-xs text-slate-400 mb-4">Item ID: {selectedItem.id} • {selectedItem.name}</p>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Next Scheduled Service Date</label>
                <input
                  type="date"
                  name="maintenanceDate"
                  required
                  defaultValue={selectedItem.maintenanceDate !== 'N/A' ? selectedItem.maintenanceDate : ''}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Maintenance Status</label>
                <select
                  name="maintenanceStatus"
                  defaultValue={selectedItem.maintenanceStatus}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#10AD69] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Save Maintenance Schedule
              </button>
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
