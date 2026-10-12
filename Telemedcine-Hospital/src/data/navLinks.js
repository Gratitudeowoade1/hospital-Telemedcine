import {
  CalendarCheck,
  UserRound,
  Stethoscope,
  CalendarDays,
  Receipt,
  PackageSearch,
  BarChart3,
  Headphones,
} from 'lucide-react'

export const clinicLinks = [
  { to: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/patients', label: 'Patients', icon: UserRound },
  { to: '/ehr', label: 'EHR', icon: Stethoscope },
  { to: '/events', label: 'Events', icon: CalendarDays },
]

export const financeLinks = [
  { to: '/billings', label: 'Billings', icon: Receipt },
  { to: '/asset-inventory', label: 'Asset and Inventory', icon: PackageSearch },
]

export const bottomLinks = [
  { to: '/usage-report', label: 'Usage Report', icon: BarChart3 },
  { to: '/support', label: 'Support', icon: Headphones },
]
