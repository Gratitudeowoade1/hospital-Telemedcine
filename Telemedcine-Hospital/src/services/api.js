const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Token and Auth session utilities
 */
export const authStorage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
};

/**
 * Helper to execute HTTP requests to the backend API with authentication headers
 */
async function request(endpoint, options = {}) {
  const token = authStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If request failed because server is offline or network error
    if (!err.status) {
      console.warn(`[API] Server unreachable at ${BASE_URL}${endpoint}:`, err.message);
    }
    throw err;
  }
}

export const api = {
  // 4. Health Check
  checkHealth: () => request('/health'),

  // 5. Authentication
  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      authStorage.setToken(data.token);
    }
    if (data.user) {
      authStorage.setUser(data.user);
    }
    return data;
  },
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getMe: () => request('/auth/me'),
  logout: () => {
    authStorage.clearToken();
  },

  // 6. Patients
  getPatients: () => request('/patients'),
  getPatientById: (id) => request(`/patients/${id}`),
  updateVitals: (id, vitals) =>
    request(`/patients/${id}/vitals`, {
      method: 'PUT',
      body: JSON.stringify(vitals),
    }),

  // 7. Appointments
  getAppointments: (params = '') => request(`/appointments${params}`),
  getNextPatient: () => request('/appointments/next-patient'),
  createAppointment: (appointmentData) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  updateAppointmentStatus: (id, status) =>
    request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // 8. Electronic Health Records (EHR) & Lab Tests
  getEHRRecords: () => request('/ehr'),
  getLabTests: () => request('/ehr/lab-tests'),
  createEHRRecord: (record) =>
    request('/ehr', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  // 9. Billings & Invoices
  getBillings: () => request('/billings'),
  getBillingSummary: () => request('/billings/summary'),
  createInvoice: (invoice) =>
    request('/billings', {
      method: 'POST',
      body: JSON.stringify(invoice),
    }),

  // 10. Asset Inventory
  getInventory: () => request('/inventory'),
  updateStock: (id, quantity) =>
    request(`/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),

  // 11. Support Tickets
  getSupportTickets: () => request('/support'),
  createSupportTicket: (ticket) =>
    request('/support', {
      method: 'POST',
      body: JSON.stringify(ticket),
    }),

  // 12. Analytics
  getDashboardStats: () => request('/analytics/dashboard-stats'),
};

export default api;
