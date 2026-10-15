import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export async function getEmployees(search = '', signal) {
  const response = await api.get('/employees', { params: search ? { search } : {}, signal })
  return response.data
}

export async function createEmployee(employee) {
  const response = await api.post('/employees', employee)
  return response.data.data
}

export async function updateEmployee(id, employee) {
  const response = await api.put(`/employees/${id}`, employee)
  return response.data.data
}

export async function deleteEmployee(id) {
  const response = await api.delete(`/employees/${id}`)
  return response.data.data
}

export function getApiError(error) {
  return error.response?.data?.error?.message || 'Could not reach the employee service. Check that the backend is running.'
}
