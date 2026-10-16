# Employee CRUD App: Beginner Guide

## Run the app

PostgreSQL must be running, and `backend/.env` must contain the local database settings. Keep the password in `.env`; do not put it in React files or commit it to Git.

Open two PowerShell terminals. In the first, start the API:

```powershell
cd D:\curd\backend
npm.cmd run dev
```

In the second, start the React interface:

```powershell
cd D:\curd\frontend
npm.cmd run dev
```

Open the local URL Vite prints, usually `http://localhost:5173`. The API health check is `http://localhost:5000/api/health`.

## Employee information

The employee form includes:

- Required name and email (email must be unique).
- Optional mobile number and designation.
- Department dropdown and employment status dropdown.
- Optional gender radio group.
- Optional PNG, JPEG, WEBP, or GIF photo up to 1.5 MB.

Photos are stored as data URLs in PostgreSQL. Express accepts JSON request bodies up to 2 MB. Keep database dumps private because they contain employee details and photos.

## How the pieces work together

1. React displays the employee form, profile view, and directory in the browser.
2. Axios sends HTTP requests from React to the Express API.
3. Express parses JSON, checks request values, and calls the employee controller.
4. The controller uses `pg` and parameterized SQL to read or update PostgreSQL records.
5. Express returns JSON, and React refreshes the directory after an update.

The frontend and backend have separate folders and separate `package.json` files. The root `package.json` is not used to start either app.

## File guide

### Backend (`backend/`)

- `package.json` lists backend packages and its `dev` and `start` commands.
- `.env` stores local PostgreSQL settings and is ignored by Git.
- `.env.example` lists the settings to configure, with a placeholder password.
- `db.js` creates a reusable PostgreSQL connection pool.
- `server.js` starts Express, allows requests from the local frontend, sets the 2 MB JSON limit, and exposes `/api/health`.
- `routes/employeeRoutes.js` maps employee URLs and HTTP methods to controller functions.
- `controllers/employeeController.js` validates employee values and runs parameterized SQL for list, search, create, read, update, and delete.
- `middleware/errorHandler.js` turns API errors into JSON responses and handles duplicate-email errors.

### Frontend (`frontend/`)

- `package.json` lists React, Vite, and Axios.
- `src/main.jsx` attaches the React app to the page; `src/App.jsx` opens the dashboard.
- `src/index.css` contains layout, responsive, form, table, and dialog styles.
- `src/pages/EmployeeDashboard.jsx` loads and searches records and coordinates actions.
- `src/components/EmployeeForm.jsx` adds and edits employee details, including dropdowns, gender options, and photo upload.
- `src/components/EmployeeTable.jsx` displays employee records and View/Edit/Delete actions.
- `src/components/EmployeeDetails.jsx` displays a profile.
- `src/components/ConfirmDialog.jsx` summarizes the selected employee before deletion.
- `src/components/Navbar.jsx` displays the top bar.
- `src/services/employeeService.js` keeps Axios API calls in one place.

### Database and project docs

- `database/schema.sql` creates the current employees table and adds missing columns to an existing database.
- `backups/` contains private SQL dumps with employee records; it is ignored by Git.
- `PORTABLE_BACKUP.md` explains how to restore a SQL dump on another computer.
- `ROADMAP.md` lists shipped work and proposed future improvements.

## API routes

- `GET /api/employees` — list employees; add `?search=term` to search names, emails, mobile numbers, designations, and departments.
- `GET /api/employees/:id` — get one employee.
- `POST /api/employees` — create an employee.
- `PUT /api/employees/:id` — update an employee.
- `DELETE /api/employees/:id` — delete an employee.
- `GET /api/health` — check the API and PostgreSQL connection.

The employee table contains `name`, `email`, `mobile`, `designation`, `department`, `employment_status`, `gender`, `photo`, and `created_at` fields. Name and email are required; the other profile fields are optional except employment status, which defaults to `Active`.

## Useful checks

From `frontend/`, run `npm.cmd run lint` for lint checks and `npm.cmd run build` to create a production build. The normal development workflow uses the two `npm.cmd run dev` commands above.
