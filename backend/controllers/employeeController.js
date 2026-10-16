const pool = require('../db');

const employeeColumns = 'id, name, email, mobile, designation, department, employment_status, gender, photo, created_at';

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateEmployee(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const mobile = body.mobile == null ? '' : String(body.mobile).trim();
  const designation = typeof body.designation === 'string' ? body.designation.trim() : '';
  const department = typeof body.department === 'string' ? body.department.trim() : '';
  const employmentStatus = typeof body.employment_status === 'string' ? body.employment_status : 'Active';
  const gender = body.gender == null || body.gender === '' ? null : body.gender;
  const photo = body.photo == null ? null : body.photo;

  if (!name || name.length > 100) return { error: 'Name is required and must be at most 100 characters.' };
  if (!email || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a valid email address (maximum 150 characters).' };
  }
  if (mobile && !/^\+?[0-9 ()-]{7,15}$/.test(mobile)) {
    return { error: 'Enter a valid mobile number, or leave it blank.' };
  }
  if (designation.length > 100) return { error: 'Designation must be at most 100 characters.' };
  if (department.length > 80) return { error: 'Department must be at most 80 characters.' };
  if (!['Active', 'On leave', 'Inactive'].includes(employmentStatus)) return { error: 'Choose a valid employment status.' };
  if (gender !== null && !['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Self-describe'].includes(gender)) return { error: 'Choose a valid gender option.' };
  if (photo !== null && (typeof photo !== 'string' || photo.length > 2_000_000 || !/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+=*$/.test(photo))) {
    return { error: 'Upload a PNG, JPG, WEBP, or GIF image up to 1.5 MB.' };
  }

  return { value: { name, email, mobile: mobile || null, designation: designation || null, department: department || null, employmentStatus, gender, photo } };
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, error: { message } });
}

async function listEmployees(req, res, next) {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const [result, count] = await Promise.all([
      search
        ? pool.query(
          `SELECT ${employeeColumns} FROM employees
           WHERE name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1 OR designation ILIKE $1 OR department ILIKE $1
           ORDER BY id DESC`,
          [`%${search}%`],
        )
        : pool.query(`SELECT ${employeeColumns} FROM employees ORDER BY id DESC`),
      pool.query('SELECT COUNT(*)::int AS total FROM employees'),
    ]);

    return res.json({
      success: true,
      data: result.rows,
      meta: { total: count.rows[0].total, displayed: result.rowCount },
    });
  } catch (error) {
    return next(error);
  }
}

async function getEmployee(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return badRequest(res, 'Employee ID must be a positive integer.');

  try {
    const result = await pool.query(`SELECT ${employeeColumns} FROM employees WHERE id = $1`, [id]);
    if (!result.rowCount) {
      return res.status(404).json({ success: false, error: { message: 'Employee not found.' } });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

async function createEmployee(req, res, next) {
  const validated = validateEmployee(req.body || {});
  if (validated.error) return badRequest(res, validated.error);

  try {
    const { name, email, mobile, designation, department, employmentStatus, gender, photo } = validated.value;
    const result = await pool.query(
      `INSERT INTO employees (name, email, mobile, designation, department, employment_status, gender, photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${employeeColumns}`,
      [name, email, mobile, designation, department, employmentStatus, gender, photo],
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

async function updateEmployee(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return badRequest(res, 'Employee ID must be a positive integer.');
  const validated = validateEmployee(req.body || {});
  if (validated.error) return badRequest(res, validated.error);

  try {
    const { name, email, mobile, designation, department, employmentStatus, gender, photo } = validated.value;
    const result = await pool.query(
      `UPDATE employees SET name = $1, email = $2, mobile = $3, designation = $4,
       department = $5, employment_status = $6, gender = $7, photo = $8
       WHERE id = $9 RETURNING ${employeeColumns}`,
      [name, email, mobile, designation, department, employmentStatus, gender, photo, id],
    );
    if (!result.rowCount) {
      return res.status(404).json({ success: false, error: { message: 'Employee not found.' } });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

async function deleteEmployee(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return badRequest(res, 'Employee ID must be a positive integer.');

  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) {
      return res.status(404).json({ success: false, error: { message: 'Employee not found.' } });
    }
    return res.json({ success: true, data: { id: result.rows[0].id } });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
