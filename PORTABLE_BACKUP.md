# Move this app to another computer

The GitHub repository stores the application source and `database/schema.sql` (the database structure). A timestamped PostgreSQL SQL dump in the local `backups` folder stores the database structure and employee records. That dump is intentionally ignored by Git; keep it private because it may contain personal information.

## On the new computer

Install Node.js/npm and PostgreSQL. Use PostgreSQL 18 or newer when possible because this backup was made from PostgreSQL 18.6.

1. Clone the GitHub repository and open the project folder.
2. Create an empty database named `employee_crud` using the PostgreSQL account you will use for the app.
3. Restore the timestamped `.sql` file from the backup folder into that database.
4. Copy `backend/.env.example` to `backend/.env` and enter the new computer's local database settings and password. Never copy a real `.env` file between computers or commit it to Git.
5. Open two terminals. In the first, run `cd backend`, `npm ci`, then `npm run dev`. In the second, run `cd frontend`, `npm ci`, then `npm run dev`.
6. Open the local address printed by Vite, usually `http://localhost:5173`.

For Windows PowerShell, use `npm.cmd` if `npm` is blocked by the PowerShell script policy. The SQL file is a plain-text PostgreSQL dump; it can be restored on Windows, macOS, or Linux using PostgreSQL's `psql` command-line tool.

## Example restore commands

These commands assume the database does not already exist. Choose the matching commands for the new computer and replace the dump filename with the timestamped SQL file from your backup copy.

Windows PowerShell:

```powershell
createdb -U postgres employee_crud
psql -U postgres -d employee_crud -f .\backups\employee-crud-database-<timestamp>.sql
```

macOS or Linux:

```sh
createdb -U postgres employee_crud
psql -U postgres -d employee_crud < ./backups/employee-crud-database-<timestamp>.sql
```
