import { useState, useEffect } from 'react'
import {
  Sparkles,
  Upload,
  RotateCw,
  Stethoscope
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

// Initial dummy AI analysis records
const INITIAL_ANALYSES = [
  {
    id: 'DIA-2091',
    patientName: 'Polly Richardson',
    date: '2026-06-25',
    imageType: 'Chest X-Ray',
    symptoms: 'Persistent cough, high fever, shortness of breath',
    diagnosis: 'Bacterial Pneumonia (Left Lower Lobe)',
    confidence: 94.7,
    risk: 'High',
    insights: 'Consolidation observed in left lower lobe compatible with active bacterial infection. Immediate antibiotic course recommended.',
    tests: ['Sputum Culture', 'Blood Count (CBC)', 'Follow-up Chest X-Ray in 14 days'],
    specialist: 'Dr. Sarah Myers (Pulmonologist)'
  },
  {
    id: 'DIA-2092',
    patientName: 'Akin Yemi',
    date: '2026-06-27',
    imageType: 'Brain MRI Scan',
    symptoms: 'Severe recurrent migraines, visual aura, dizziness',
    diagnosis: 'Migraine Aura (Non-structural)',
    confidence: 82.3,
    risk: 'Moderate',
    insights: 'No structural lesions, microvascular ischemic changes or mass effects detected. Symptoms align with vascular migraine syndromes.',
    tests: ['MRI Angiography', 'Visual Field Examination'],
    specialist: 'Dr. Helen Vance (Neurologist)'
  },
  {
    id: 'DIA-2093',
    patientName: 'Funke Akindele',
    date: '2026-06-28',
    imageType: 'ECG Rhythm Strip',
    symptoms: 'Palpitations, chest tightness, anxiety',
    diagnosis: 'Sinus Tachycardia',
    confidence: 91.5,
    risk: 'Moderate',
    insights: 'Regular narrow complex rhythm at 112 bpm. Normal axis and intervals. No acute ST-segment changes or ischemia.',
    tests: ['Thyroid Panel (TSH)', 'Holter Monitor (24h)'],
    specialist: 'Dr. Richard Henderson (Cardiologist)'
  },
  {
    id: 'DIA-2094',
    patientName: 'Grace Yinusa',
    date: '2026-06-29',
    imageType: 'Dermatoscopy Scan',
    symptoms: 'Asymmetrical dark mole on left forearm',
    diagnosis: 'Benign Melanocytic Nevus',
    confidence: 97.2,
    risk: 'Low',
    insights: 'Symmetrical network, no atypical vessels or pigment leakage. Reassuring benign presentation. Monitor for ABCDE changes.',
    tests: ['Annual Dermatological Exam'],
    specialist: 'Dr. Chloe Adams (Dermatologist)'
  }
]

// Diagnostic Line Chart Runs over time
const DIAG_RUN_DATA = [
  { day: 'Mon', Runs: 12, HighRisk: 2 },
  { day: 'Tue', dayNum: 2, Runs: 18, HighRisk: 4 },
  { day: 'Wed', dayNum: 3, Runs: 15, HighRisk: 1 },
  { day: 'Thu', dayNum: 4, Runs: 22, HighRisk: 5 },
  { day: 'Fri', dayNum: 5, Runs: 25, HighRisk: 3 },
  { day: 'Sat', dayNum: 6, Runs: 9, HighRisk: 0 }
]

export default function AIDiagnosis() {
  const [analyses, setAnalyses] = useState(() => {
    const saved = localStorage.getItem('hospital_analyses')
    return saved ? JSON.parse(saved) : INITIAL_ANALYSES
  })

  // State controls
  const [activeTab, setActiveTab] = useState('run') // 'run', 'history', 'charts'
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  
  // Input form state
  const [patientName, setPatientName] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [imageType, setImageType] = useState('Chest X-Ray')
  const [, setUploadedFile] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [formError, setFormError] = useState('')

  // AI Loading Simulator
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
  const [aiLoadingStep, setAiLoadingStep] = useState(0)
  const [loadingMessages] = useState([
    'Processing uploaded files and DICOM medical images...',
    'Segmenting anatomical regions and scanning anomalies...',
    'Cross-referencing symptoms checklists with medical databases...',
    'Evaluating risk indicators and computing diagnosis confidence...',
    'Finalizing diagnostic report recommendations...'
  ])

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hospital_analyses', JSON.stringify(analyses))
  }, [analyses])

  // Stats calculation
  const totalRuns = analyses.length
  const highRiskCount = analyses.filter(a => a.risk === 'High' || a.risk === 'Critical').length
  const avgConfidence = Math.round(
    analyses.reduce((sum, a) => sum + a.confidence, 0) / (analyses.length || 1)
  )

  // Form Submit: Run AI Diagnosis
  const handleRunAIDiagnosis = (e) => {
    e.preventDefault()
    if (!patientName.trim() || !symptoms.trim()) {
      setFormError('Please fill in Patient Name and describe symptoms.')
      return
    }
    setFormError('')
    setIsAIAnalyzing(true)
    setAiLoadingStep(0)

    // Progression of loading steps
    const interval = setInterval(() => {
      setAiLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, 1000)

    // Add diagnosis after 5.5 seconds
    setTimeout(() => {
      // Mocked AI output mapping based on symptoms keywords
      let mockDiag = 'Influenza / Upper Respiratory Infection'
      let mockRisk = 'Low'
      let mockConf = 89.4
      let mockInsights = 'Symptom pattern suggests acute viral respiratory infection. No sign of vascular or pulmonary consolidation.'
      let mockTests = ['Rapid Flu Test', 'Symptomatic hydration care']
      let mockSpecialist = 'Dr. Sarah Myers (General Practitioner)'

      const sympLower = symptoms.toLowerCase()
      if (sympLower.includes('chest') || sympLower.includes('breath') || sympLower.includes('cough')) {
        mockDiag = 'Bacterial Pneumonia (Right Upper Lobe)'
        mockRisk = 'High'
        mockConf = 92.1
        mockInsights = 'Assessed densities in right upper lung fields. High probability of alveolar infiltration. Antibiotic treatment indicated.'
        mockTests = ['Blood Cultures', 'Sputum PCR Panel']
        mockSpecialist = 'Dr. Sarah Myers (Pulmonologist)'
      } else if (sympLower.includes('heart') || sympLower.includes('palpitations') || sympLower.includes('pain')) {
        mockDiag = 'Atypical Angina Pectoris'
        mockRisk = 'Critical'
        mockConf = 87.5
        mockInsights = 'Non-specific ECG abnormalities and symptom alerts of chest tightness. Cardiovascular workup required immediately.'
        mockTests = ['Cardiac Troponin I', 'Exercise Stress Test', 'Echocardiogram']
        mockSpecialist = 'Dr. Richard Henderson (Cardiologist)'
      } else if (sympLower.includes('head') || sympLower.includes('migraine') || sympLower.includes('aura')) {
        mockDiag = 'Migraine Headaches (Refractory)'
        mockRisk = 'Moderate'
        mockConf = 91.0
        mockInsights = 'Recurrent cranial symptoms without focal motor deficits. Advise pharmacological prophylaxis.'
        mockTests = ['Neurological Evaluation', 'Contrast Head MRI']
        mockSpecialist = 'Dr. Helen Vance (Neurologist)'
      }

      const newAnalysis = {
        id: `DIA-${Math.floor(2000 + Math.random() * 8000)}`,
        patientName,
        date: new Date().toISOString().split('T')[0],
        imageType: uploadedImage ? imageType : 'Symptom-Only Input',
        symptoms,
        diagnosis: mockDiag,
        confidence: mockConf,
        risk: mockRisk,
        insights: mockInsights,
        tests: mockTests,
        specialist: mockSpecialist
      }

      const updated = [newAnalysis, ...analyses]
      setAnalyses(updated)
      setSelectedAnalysis(newAnalysis)
      
      // Reset form
      setPatientName('')
      setSymptoms('')
      setUploadedFile(null)
      setUploadedImage(null)
      setIsAIAnalyzing(false)
    }, 5500)
  }

  // Handle mock image upload selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      // Create a mock local object URL for preview
      setUploadedImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen w-full font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="text-blue-500 fill-blue-100" />
            <span>AI Diagnostics Assistant</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Submit radiological scans, map patient symptoms, and let clinical models predict diagnoses.</p>
        </div>
      </div>

      {/* ── AI STATS OVERVIEW ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Diagnostic Runs', val: totalRuns, desc: 'Total AI reports generated', color: 'border-l-blue-500' },
          { label: 'Critical Risk Alerts', val: highRiskCount, desc: 'High/Critical risk reports', color: 'border-l-rose-500', alert: highRiskCount > 0 },
          { label: 'Avg AI Confidence', val: `${avgConfidence}%`, desc: 'Model calibration accuracy', color: 'border-l-emerald-500' },
          { label: 'System Accuracy', val: '98.4%', desc: 'Hl7 certified model standard', color: 'border-l-purple-500' }
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

      {/* ── MODULE SUB NAVIGATION TABS ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 mb-6 flex gap-2 overflow-x-auto shadow-2xs no-scrollbar">
        {[
          { id: 'run', label: 'Run Diagnostic Analysis' },
          { id: 'history', label: 'Analysis History Ledger' },
          { id: 'charts', label: 'Analytics Insights Graph' }
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
        
        {/* LEFT COLUMN: (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: RUN DIAGNOSTIC FORM */}
          {activeTab === 'run' && (
            <div className="space-y-6">
              
              {/* Load/Run State */}
              {isAIAnalyzing ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-2xs flex flex-col items-center justify-center min-h-[350px] text-center space-y-6">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin flex items-center justify-center">
                    <Sparkles className="text-blue-500" size={20} />
                  </div>
                  
                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-bold text-slate-800 text-base">Running AI Analysis Pipeline</h3>
                    <p className="text-xs text-[#10AD69] font-semibold animate-pulse">{loadingMessages[aiLoadingStep]}</p>
                  </div>

                  {/* Staged progression indicators */}
                  <div className="w-full max-w-md bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-[10px] text-slate-400 font-bold space-y-2">
                    {loadingMessages.map((msg, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {aiLoadingStep > i ? (
                          <span className="text-emerald-500 shrink-0">✓</span>
                        ) : aiLoadingStep === i ? (
                          <RotateCw size={10} className="animate-spin text-blue-500 shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        )}
                        <span className={aiLoadingStep === i ? 'text-slate-700 font-extrabold' : ''}>{msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 font-serif flex items-center gap-1.5">
                    <Sparkles size={18} className="text-blue-500" /> Diagnosis Input Panel
                  </h3>
                  
                  <form onSubmit={handleRunAIDiagnosis} className="space-y-6">
                    
                    {/* Patient detail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Patient Name</label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Akin Yemi"
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#10AD69]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Imaging Modality Type</label>
                        <select
                          value={imageType}
                          onChange={(e) => setImageType(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                        >
                          <option value="Chest X-Ray">Chest X-Ray</option>
                          <option value="Brain MRI Scan">Brain MRI Scan</option>
                          <option value="ECG Rhythm Strip">ECG Rhythm Strip</option>
                          <option value="Dermatoscopy Scan">Dermatoscopy Scan</option>
                        </select>
                      </div>
                    </div>

                    {/* Drag-and-drop Image Upload simulation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">Upload Medical Images</label>
                        <label className="border-2 border-dashed border-slate-200 bg-[#F8FAFC] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#10AD69] transition-colors relative min-h-[160px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt="Medical Preview"
                              className="max-h-[120px] rounded-lg object-contain"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Upload className="mx-auto text-slate-400" size={24} />
                              <p className="text-xs font-semibold text-slate-600">Drag & Drop DICOM/Image</p>
                              <p className="text-[10px] text-slate-400">Supports JPEG, PNG up to 15MB</p>
                            </div>
                          )}
                        </label>
                      </div>

                      {/* Symptoms area */}
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Describe Vitals & Symptoms</label>
                        <textarea
                          rows="6"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="List vital readings and symptomatic triggers. (e.g. Cough, High Fever, Cardiac Palpitations)"
                          className="w-full border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#10AD69] flex-1 min-h-[160px]"
                        />
                      </div>
                    </div>

                    {formError && <p className="text-xs font-bold text-rose-500">{formError}</p>}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <Sparkles size={16} />
                      <span>Run AI Diagnosis Pipeline</span>
                    </button>

                  </form>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ANALYSIS LEDGER HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                        <th className="px-5 py-4">Report ID</th>
                        <th className="px-5 py-4">Patient Name</th>
                        <th className="px-5 py-4">Modality</th>
                        <th className="px-5 py-4 text-center">Confidence</th>
                        <th className="px-5 py-4 text-center">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {analyses.map(a => (
                        <tr
                          key={a.id}
                          onClick={() => setSelectedAnalysis(a)}
                          className={`hover:bg-slate-50/60 cursor-pointer transition-colors ${
                            selectedAnalysis?.id === a.id ? 'bg-[#E2F5ED]/20' : ''
                          }`}
                        >
                          <td className="px-5 py-4 text-xs font-bold text-slate-900">{a.id}</td>
                          <td className="px-5 py-4 font-semibold text-slate-800">{a.patientName}</td>
                          <td className="px-5 py-4 text-xs text-slate-500 font-medium">{a.imageType}</td>
                          <td className="px-5 py-4 text-center font-extrabold text-slate-800">{a.confidence}%</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              a.risk === 'Critical' || a.risk === 'High' ? 'bg-rose-50 text-rose-700 animate-pulse' :
                              a.risk === 'Moderate' ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {a.risk}
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

          {/* TAB 3: CHARTS */}
          {activeTab === 'charts' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-lg mb-4 font-serif">Diagnostic Operations Volume</h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DIAG_RUN_DATA}>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Runs" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="HighRisk" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center items-center gap-6 mt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  <span>Total Diagnostic Runs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span>Critical High-Risk Cases</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI REPORT INSPECTOR (1/3 width) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs min-h-[450px] flex flex-col justify-between">
            {selectedAnalysis ? (
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{selectedAnalysis.id}</span>
                    <span className="block text-[9px] text-slate-400 font-medium">{selectedAnalysis.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    selectedAnalysis.risk === 'High' || selectedAnalysis.risk === 'Critical' ? 'bg-rose-50 text-rose-700 animate-pulse' :
                    selectedAnalysis.risk === 'Moderate' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-[#10AD69]'
                  }`}>
                    {selectedAnalysis.risk} Risk
                  </span>
                </div>

                {/* Suggested Diagnosis Details */}
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">AI Suggested Diagnosis</span>
                  <h4 className="text-base font-bold text-slate-800 font-serif leading-snug">{selectedAnalysis.diagnosis}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Input mod: {selectedAnalysis.imageType}</span>
                </div>

                {/* Radial Gauge Simulator: Confidence rating */}
                <div className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-100 p-3 rounded-2xl shadow-3xs">
                  <div className="w-12 h-12 rounded-full border-4 border-[#10AD69] border-t-transparent flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-extrabold text-[#10AD69]">{Math.round(selectedAnalysis.confidence)}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Model Confidence</span>
                    <p className="text-xs text-slate-600 font-semibold leading-normal">Clinical probability margin rating.</p>
                  </div>
                </div>

                {/* Insights Description */}
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Clinical AI Insights</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                    {selectedAnalysis.insights}
                  </p>
                </div>

                {/* Follow-up / Specialist */}
                <div className="space-y-2 border-t border-dashed border-slate-100 pt-3 text-xs text-slate-600 font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Recommended Follow-up Tests</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                      {selectedAnalysis.tests.map((test, idx) => (
                        <li key={idx}>{test}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Consulting Specialist</span>
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Stethoscope size={13} className="text-slate-400" />
                      <span>{selectedAnalysis.specialist}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <Sparkles size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Review AI Report</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Fill in symptom descriptions, select DICOM images, run prediction analysis pipelines, or review reports.</p>
              </div>
            )}
          </div>

          {/* Interactive Medical History Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4">Patient Diagnostics Timeline</h3>
            <div className="space-y-4 relative pl-4 border-l border-slate-100">
              {analyses.slice(0, 3).map((a, idx) => (
                <div key={idx} className="relative space-y-1">
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>{a.date}</span>
                    <span>ID: {a.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 hover:text-blue-500 cursor-pointer" onClick={() => setSelectedAnalysis(a)}>
                    {a.diagnosis}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">Confidence Score: {a.confidence}%</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Styled custom scrollbars configuration */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  )
}
