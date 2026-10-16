import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import EmployeeForm from '../components/EmployeeForm.jsx'
import EmployeeTable from '../components/EmployeeTable.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmployeeDetails from '../components/EmployeeDetails.jsx'
import { createEmployee, deleteEmployee, getApiError, getEmployees, updateEmployee } from '../services/employeeService.js'

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    getEmployees(search, controller.signal)
      .then((result) => {
        setEmployees(result.data)
        setTotalEmployees(result.meta.total)
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') setPageError(getApiError(error))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [search, refreshKey])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  function openAddForm() {
    setEditing(null)
    setFormError('')
    setShowForm(true)
  }

  function openEditForm(employee) {
    setViewing(null)
    setEditing(employee)
    setFormError('')
    setShowForm(true)
  }

  async function saveEmployee(values) {
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        await updateEmployee(editing.id, values)
        setNotice('Employee details updated.')
      } else {
        await createEmployee(values)
        setNotice('Employee added successfully.')
      }
      setShowForm(false)
      setLoading(true)
      setRefreshKey((key) => key + 1)
    } catch (error) {
      setFormError(getApiError(error))
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteEmployee(pendingDelete.id)
      setNotice('Employee deleted.')
      setPendingDelete(null)
      setLoading(true)
      setRefreshKey((key) => key + 1)
    } catch (error) {
      setPageError(getApiError(error))
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main id="main" className="dashboard">
        <div className="page-heading">
          <div><span className="eyebrow">PEOPLE OPERATIONS</span><h1>Employee management</h1><p>Keep your team directory organized and up to date.</p></div>
          <button className="button button-primary add-button" type="button" onClick={openAddForm}><span aria-hidden="true">＋</span> Add employee</button>
        </div>

        <section className="summary-grid" aria-label="Employee summary">
          <article className="summary-card"><div className="summary-icon blue-icon" aria-hidden="true">♙</div><div><span>Total employees</span><strong>{loading ? '—' : totalEmployees}</strong></div><small>In your directory</small></article>
          <article className="summary-card"><div className="summary-icon violet-icon" aria-hidden="true">▤</div><div><span>Showing</span><strong>{loading ? '—' : employees.length}</strong></div><small>{search ? 'Matching your search' : 'Records on this page'}</small></article>
        </section>

        <section className="directory-card" aria-labelledby="directory-title">
          <div className="directory-heading">
            <div><h2 id="directory-title">Team directory</h2><p>View and manage your employee records.</p></div>
            <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Search employees</span><input value={search} onChange={(event) => { setPageError(''); setLoading(true); setSearch(event.target.value) }} placeholder="Search employees…" />{search && <button type="button" onClick={() => { setPageError(''); setLoading(true); setSearch('') }} aria-label="Clear search">×</button>}</label>
          </div>
          {pageError && <div className="alert alert-error" role="alert"><span>{pageError}</span><button type="button" onClick={() => { setPageError(''); setLoading(true); setRefreshKey((key) => key + 1) }}>Try again</button></div>}
          {notice && <div className="alert alert-success" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
          {loading ? <div className="loading-state" role="status"><span className="spinner" /> Loading employees…</div> : <EmployeeTable employees={employees} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />}
          {!loading && !pageError && <div className="table-footer">Showing <strong>{employees.length}</strong> of <strong>{totalEmployees}</strong> employees</div>}
        </section>
        <footer className="page-footer">PeopleDesk <span>·</span> Employee directory</footer>
      </main>
      {showForm && <EmployeeForm employee={editing} saving={saving} error={formError} onCancel={() => setShowForm(false)} onSave={saveEmployee} />}
      <EmployeeDetails employee={viewing} onClose={() => setViewing(null)} onEdit={openEditForm} />
      <ConfirmDialog employee={pendingDelete} deleting={deleting} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
    </div>
  )
}
