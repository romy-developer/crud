# Employee CRUD Application

A local employee directory built with React, Vite, Node.js, Express, and PostgreSQL.

## Current features

- Add, view, edit, search, and delete employee records.
- Store name, email, mobile, designation, department, employment status, optional gender, and an optional photo.
- Choose department and employment status from dropdowns and gender from an optional radio group.
- Validate employee fields on the API and prevent duplicate email addresses.
- Keep the React frontend, Express API, and PostgreSQL database separate.

Employee photos accept PNG, JPEG, WEBP, or GIF files up to 1.5 MB. The API accepts JSON request bodies up to 2 MB. Photos are stored as data URLs in PostgreSQL; keep the database and backups private because employee records contain personal information.

## Requirements

Install Node.js with npm and PostgreSQL. The project was developed with PostgreSQL 18.6. The database structure is in [`database/schema.sql`](database/schema.sql). It creates the current table for a new database and adds newer columns safely to an existing table.

For a new database, run:

```powershell
createdb -U postgres employee_crud
psql -U postgres -d employee_crud -f .\database\schema.sql
```

For an existing database, run the same `schema.sql` file to apply any missing columns. It uses `CREATE TABLE IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS`.

## Configure and install

Copy `backend/.env.example` to `backend/.env` and set your local PostgreSQL connection details. Keep `.env` private and out of the frontend.

Install dependencies in each app folder:

```powershell
cd D:\curd\backend
npm.cmd ci
```

```powershell
cd D:\curd\frontend
npm.cmd ci
```

Use `npm.cmd` in Windows PowerShell if the `npm` command is blocked by the script execution policy.

## Run locally

Start the backend and frontend in separate terminals:

```powershell
cd D:\curd\backend
npm.cmd run dev
```

```powershell
cd D:\curd\frontend
npm.cmd run dev
```

Open the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173). The API health endpoint is [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Database backups

`database/schema.sql` contains the database structure. Timestamped SQL dumps in `backups/` contain the structure and employee data, and are intentionally ignored by Git. Store and transfer them securely. See [`PORTABLE_BACKUP.md`](PORTABLE_BACKUP.md) for restore instructions.

## Project roadmap

See [`ROADMAP.md`](ROADMAP.md) for delivered features and suggested next steps.

## Main folders

- `backend/` — Express API, PostgreSQL connection, validation, and CRUD routes.
- `frontend/` — React and Vite interface.
- `database/schema.sql` — current schema and safe column additions for existing databases.
- `backups/` — private local database dumps; do not commit these files.
- `BEGINNER_GUIDE.md` — explanation of the files and how the app works.
- `ROADMAP.md` — current project state and possible next releases.
