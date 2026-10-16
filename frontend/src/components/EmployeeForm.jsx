import { useState } from 'react'

const emptyEmployee = { name: '', email: '', mobile: '', designation: '', department: '', employment_status: 'Active', gender: '', photo: null }
const departments = ['Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Operations', 'Customer Support', 'Other']

export default function EmployeeForm({ employee, saving, error, onCancel, onSave }) {
  const [values, setValues] = useState({ ...emptyEmployee, ...employee })
  const [validationError, setValidationError] = useState('')

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function choosePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 1_500_000) {
      setValidationError('Choose a PNG, JPG, WEBP, or GIF image up to 1.5 MB.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setValues((current) => ({ ...current, photo: reader.result }))
      setValidationError('')
    }
    reader.readAsDataURL(file)
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
      <section className="modal-card form-modal" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
        <div className="modal-heading">
          <div><span className="eyebrow">EMPLOYEE DETAILS</span><h2 id="employee-form-title">{employee ? 'Edit employee' : 'Add employee'}</h2></div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Close form">×</button>
        </div>
        <form onSubmit={submit} className="employee-form">
          <div className="photo-picker">
            {values.photo ? <img className="photo-preview" src={values.photo} alt="Employee preview" /> : <span className="photo-placeholder" aria-hidden="true">Photo</span>}
            <label>Employee photo <span className="optional">Optional · up to 1.5 MB</span>
              <input name="photo_upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={choosePhoto} />
            </label>
            {values.photo && <button className="text-action danger-text" type="button" onClick={() => setValues((current) => ({ ...current, photo: null }))}>Remove photo</button>}
          </div>
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
          <div className="form-row">
            <label>Department <span className="optional">Optional</span>
              <select name="department" value={values.department || ''} onChange={updateField}>
                <option value="">Select department</option>
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            </label>
            <label>Employment status
              <select name="employment_status" value={values.employment_status || 'Active'} onChange={updateField}>
                <option>Active</option><option>On leave</option><option>Inactive</option>
              </select>
            </label>
          </div>
          <fieldset className="gender-fieldset">
            <legend>Gender <span className="optional">Optional</span></legend>
            <div className="radio-options">
              {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((option) => (
                <label className="radio-option" key={option}>
                  <input type="radio" name="gender" value={option} checked={(values.gender || '') === option} onChange={updateField} />
                  <span>{option}</span>
                </label>
              ))}
              {values.gender && <button className="text-action" type="button" onClick={() => setValues((current) => ({ ...current, gender: '' }))}>Clear</button>}
            </div>
          </fieldset>
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
