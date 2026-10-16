function Detail({ label, value }) {
  return <div className="detail-item"><span>{label}</span><strong>{value || 'Not provided'}</strong></div>
}

export default function EmployeeDetails({ employee, onClose, onEdit }) {
  if (!employee) return null
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card details-card" role="dialog" aria-modal="true" aria-labelledby="employee-details-title">
        <div className="modal-heading">
          <div><span className="eyebrow">EMPLOYEE PROFILE</span><h2 id="employee-details-title">Employee details</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>
        <div className="details-person">
          {employee.photo ? <img className="details-photo" src={employee.photo} alt={employee.name} /> : <span className="details-photo details-initials">{employee.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>}
          <div><h3>{employee.name}</h3><span>Employee #{employee.id}</span></div>
        </div>
        <div className="details-grid">
          <Detail label="Email address" value={employee.email} /><Detail label="Mobile number" value={employee.mobile} />
          <Detail label="Designation" value={employee.designation} /><Detail label="Department" value={employee.department} />
          <Detail label="Employment status" value={employee.employment_status || 'Active'} /><Detail label="Gender" value={employee.gender} />
          <Detail label="Added" value={employee.created_at ? new Date(employee.created_at).toLocaleDateString() : ''} />
        </div>
        <div className="modal-actions"><button className="button button-quiet" type="button" onClick={onClose}>Close</button><button className="button button-primary" type="button" onClick={() => onEdit(employee)}>Edit employee</button></div>
      </section>
    </div>
  )
}
