import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import AuthGuard from '../guards/AuthGuard'
import Login from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard/Dashboard'
import Appointments from '../pages/Appointments/Appointments'
import EHR from '../pages/EHR/EHR'
import Analytics from '../pages/Analytics/Analytics'  
import History from '../pages/History/History'
import Events from '../pages/Events/Events'
import Billings from '../pages/Billings/Billings'
import AssetInventory from '../pages/AssetInventory/AssetInventory'
import UsageReport from '../pages/UsageReport/UsageReport'
import Support from '../pages/Support/Support'
import AIDiagnosis from '../pages/AIDiagnosis/AIDiagnosis'
import Notifications from '../pages/Notifications/Notifications'
import Settings from '../pages/Settings/Settings'
import Profile from '../pages/Profile/Profile'
import Emergency from '../pages/Emergency/Emergency'
import PatientDashboard from "../pages/Patients/Patients"; 

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    <Route
      element={
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      }
    >
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard title="Doctor Dashboard" />} />
      
      {/* <Route path="/patient-dashboard" element={<PatientDashboard />} /> */}
      <Route path="/patients" element={<PatientDashboard/>} />
      <Route path="/usage-report" element={<UsageReport />} />
      
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/ehr" element={<EHR />} />
      <Route path="/history" element={<History />} />
      <Route path="/events" element={<Events />} />
      <Route path="/billings" element={<Billings />} />
      <Route path="/asset-inventory" element={<AssetInventory />} />
      <Route path="/support" element={<Support />} />
      <Route path="/ai-diagnosis" element={<AIDiagnosis />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/emergency" element={<Emergency />} />
    </Route>
    
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
)

export default AppRoutes