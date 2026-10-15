# Employee CRUD App: Beginner Guide

## Run the app

PostgreSQL must be running, and `backend/.env` must contain your local PostgreSQL password. Keep that password in `.env`; do not put it in React files or send it in chat. The backend `.gitignore` excludes `.env` from Git.

Open two PowerShell terminals.

In terminal 1, start the API:

```powershell
cd D:\curd\backend
npm.cmd run dev
```

You should see `Employee API listening on http://localhost:5000`.

In terminal 2, start React:

```powershell
cd D:\curd\frontend
npm.cmd run dev
```

Open the local address Vite prints, usually `http://localhost:5173`.

To check the backend, open `http://localhost:5000/api/health`. A successful response says the API and PostgreSQL are connected.

## How the pieces work together

1. React displays the employee form and table in your browser.
2. Axios sends HTTP requests from React to the Express API.
3. Express checks the request and calls the employee controller.
4. The controller uses `pg` and parameterized SQL to read or change PostgreSQL records.
5. Express returns JSON, and React refreshes the screen with the result.

The frontend and backend have separate folders and separate `package.json` files. The root `package.json` is preserved and is not used to start either app.

## File guide

### Backend (`backend/`)

- `package.json` lists the backend packages and its `dev` and `start` commands.
- `.env` stores your local database settings and password. It is ignored by Git.
- `.env.example` shows which settings are needed, with a placeholder instead of a real password.
- `.gitignore` prevents `.env` and `node_modules` from being committed.
- `db.js` creates a reusable PostgreSQL connection pool.
- `server.js` starts Express, enables JSON and local frontend CORS, provides `/api/health`, and connects the employee routes.
- `routes/employeeRoutes.js` maps each URL and HTTP method to a controller function.
- `controllers/employeeController.js` validates employee input and runs parameterized SQL for list, search, create, read, update, and delete.
- `middleware/errorHandler.js` turns unexpected errors into safe JSON messages and duplicate-email errors into HTTP 409.

### Frontend (`frontend/`)

- `package.json` lists React, Vite, and Axios.
- `.env.example` documents the API base URL. The frontend does not need database credentials.
- `index.html` is Vite's page shell and browser tab title.
- `src/main.jsx` attaches the React app to the page.
- `src/App.jsx` opens the employee dashboard.
- `src/index.css` contains the dashboard layout, colors, responsive styles, and modal styles.
- `src/pages/EmployeeDashboard.jsx` loads records, searches, and coordinates form and delete actions.
- `src/components/Navbar.jsx` displays the top bar.
- `src/components/EmployeeForm.jsx` adds and edits employees, with browser-side checks.
- `src/components/EmployeeTable.jsx` displays employee records and row actions.
- `src/components/ConfirmDialog.jsx` asks before deleting a record.
- `src/services/employeeService.js` keeps Axios API calls in one place.

## API routes

- `GET /api/employees` — list employees; add `?search=term` to search.
- `GET /api/employees/:id` — get one employee.
- `POST /api/employees` — create an employee.
- `PUT /api/employees/:id` — update an employee.
- `DELETE /api/employees/:id` — delete an employee.
- `GET /api/health` — check the API and PostgreSQL connection.

All employee fields are validated by the backend. Required fields are name and email. Email must be unique. Mobile and designation are optional.

## Useful checks

From `D:\curd\frontend`, run `npm.cmd run lint` to check code style and `npm.cmd run build` to create a production build. The normal development workflow uses the two `npm.cmd run dev` commands above.
