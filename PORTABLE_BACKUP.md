# Move the app and its employee data

Git stores the app source and `database/schema.sql`, but not live employee records. A timestamped PostgreSQL SQL dump in `backups/` stores both the schema and employee data. The `backups/` directory is ignored by Git. Keep dump files private because they contain personal information and employee photos.

The latest local dump is `employee-crud-database-20261016-123236.sql`. Copy the dump securely when moving the database to another computer.

## Restore on another computer

Install Node.js/npm and PostgreSQL. Use PostgreSQL 18, the version used to create the current dump. Then:

1. Clone the repository and open its folder.
2. Create an empty database named `employee_crud` using the PostgreSQL account that the app will use.
3. Copy the SQL dump into the `backups/` folder (or note its actual path).
4. Restore the dump into the empty database.
5. Copy `backend/.env.example` to `backend/.env` and enter the destination computer's database settings. Do not copy the old `.env` or commit a real password.
6. Install packages with `npm.cmd ci` in both `backend/` and `frontend/`.
7. Start the backend with `npm.cmd run dev` in `backend/`, then the frontend with `npm.cmd run dev` in `frontend/`.
8. Open the local URL printed by Vite, usually `http://localhost:5173`.

Windows PowerShell restore command (replace the filename if using another dump):

```powershell
createdb -U postgres employee_crud
psql -U postgres -d employee_crud -f .\backups\employee-crud-database-20261016-123236.sql
```

macOS or Linux:

```sh
createdb -U postgres employee_crud
psql -U postgres -d employee_crud < ./backups/employee-crud-database-20261016-123236.sql
```

If you are setting up an empty database without importing records, apply `database/schema.sql` instead. It creates the current table and adds missing columns to an existing table. Do not restore a full dump over a database with records you want to keep; take a separate backup first.

## Current employee data

The `employees` table stores name, email, mobile, designation, department, employment status, optional gender, optional photo, and creation time. Photos are stored as data URLs. SQL dumps include these images as well as employee details, so handle them like confidential personnel records.
