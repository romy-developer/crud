import { useState } from 'react'

const emptyEmployee = { name: '', email: '', mobile: '', designation: '' }

export default function EmployeeForm({ employee, saving, error, onCancel, onSave }) {
  const [values, setValues] = useState(employee || emptyEmployee)
  const [validationError, setValidationError] = useState('')

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    const mobile = values.mobile.trim()
    if (mobile && !/^\+?[0-9 ()-]{7,15}$/.test(mobile)) {
      setValidationError('Enter a valid mobile number, or leave it blank.')
      return
    }
    setValidationError('')
    await onSave({ ...values, mobile })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
        <div className="modal-heading">
          <div><span className="eyebrow">EMPLOYEE DETAILS</span><h2 id="employee-form-title">{employee ? 'Edit employee' : 'Add employee'}</h2></div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Close form">×</button>
        </div>
        <form onSubmit={submit} className="employee-form">
          <label>Full name <span className="required">*</span>
            <input name="name" value={values.name} onChange={updateField} required maxLength={100} autoFocus placeholder="e.g. Jordan Lee" />
          </label>
          <label>Email address <span className="required">*</span>
            <input name="email" type="email" value={values.email} onChange={updateField} required maxLength={150} placeholder="jordan@company.com" />
          </label>
          <div className="form-row">
            <label>Mobile number <span className="optional">Optional</span>
              <input name="mobile" type="tel" value={values.mobile || ''} onChange={updateField} maxLength={15} placeholder="+1 555 010 1234" />
            </label>
            <label>Designation <span className="optional">Optional</span>
              <input name="designation" value={values.designation || ''} onChange={updateField} maxLength={100} placeholder="e.g. Designer" />
            </label>
          </div>
          {(validationError || error) && <p className="form-error" role="alert">{validationError || error}</p>}
          <div className="modal-actions">
            <button className="button button-quiet" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
