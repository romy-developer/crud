export default function ConfirmDialog({ employee, deleting, onCancel, onConfirm }) {
  if (!employee) return null
  return (
    <div className="modal-backdrop">
      <section className="modal-card confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <div className="delete-icon" aria-hidden="true">!</div>
        <h2 id="confirm-title">Delete this employee?</h2>
        <p id="confirm-description">{employee.name} will be removed from your employee list. This action can’t be undone.</p>
        <div className="delete-summary">
          {employee.photo && <img className="delete-photo" src={employee.photo} alt="" />}
          <span>{employee.email}</span>
          <span>{[employee.designation, employee.department].filter(Boolean).join(' · ') || 'No role or department'}</span>
          <span>Status: {employee.employment_status || 'Active'}</span>
          {employee.gender && <span>Gender: {employee.gender}</span>}
        </div>
        <div className="modal-actions">
          <button className="button button-quiet" type="button" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button className="button button-danger" type="button" onClick={onConfirm} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete employee'}</button>
        </div>
      </section>
    </div>
  )
}
