function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (!employees.length) {
    return <div className="empty-state"><div className="empty-icon" aria-hidden="true">⌕</div><h3>No employees found</h3><p>Try a different search, or add your first employee.</p></div>
  }

  return (
    <div className="table-scroll">
      <table className="employee-table">
        <thead><tr><th>EMPLOYEE</th><th>CONTACT</th><th>DESIGNATION</th><th>ADDED</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td data-label="Employee"><div className="person-cell"><span className="avatar">{initials(employee.name)}</span><span className="person-name">{employee.name}<small>Employee #{employee.id}</small></span></div></td>
              <td data-label="Contact"><span className="contact-email">{employee.email}</span><small className="contact-mobile">{employee.mobile || 'No mobile added'}</small></td>
              <td data-label="Designation"><span className="role-pill">{employee.designation || 'Unassigned'}</span></td>
              <td data-label="Added" className="date-cell">{employee.created_at ? new Date(employee.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
              <td data-label="Actions"><div className="row-actions"><button className="text-action" type="button" onClick={() => onEdit(employee)} aria-label={`Edit ${employee.name}`}>Edit</button><button className="text-action danger-text" type="button" onClick={() => onDelete(employee)} aria-label={`Delete ${employee.name}`}>Delete</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
