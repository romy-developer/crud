# Project Roadmap

This roadmap describes the current state and sensible next releases for the employee directory. Items under “Next” are proposals; they are not implemented yet.

## Delivered

- React/Vite employee directory with Express and PostgreSQL.
- Create, list, search, view, edit, and delete employee records.
- Required name and unique email validation, with optional mobile and designation.
- Department and employment status dropdowns, plus an optional gender radio group.
- Optional employee photo upload (PNG, JPEG, WEBP, or GIF, up to 1.5 MB), shown in the directory and profile.
- 2 MB Express JSON request limit and PostgreSQL schema additions that can be rerun safely.
- Local SQL backup and portable restore documentation.

## Next: strengthen everyday use

1. Add pagination and filters for department and employment status as the directory grows.
2. Add export to CSV and an import preview with duplicate-email checks.
3. Improve form accessibility and add focused validation and API error messages for oversized photos.

## Later: protect and operate the app

1. Add sign-in and role-based access before exposing the app beyond a trusted local network.
2. Add an audit history for employee updates and deletes.
3. Set a retention policy for employee photos and provide an option to remove them independently.
4. Add automated backend and frontend checks, then document a repeatable deployment and backup schedule.

## Data and API notes

The current `employees` table stores name, email, mobile, designation, department, employment status, gender, photo data URL, and creation time. `database/schema.sql` is the source of truth for the table shape. Apply it to a database to create missing columns. Keep SQL dumps private because they include employee personal information and photo data.

The API currently accepts JSON bodies up to 2 MB. Photo uploads are limited by the form to 1.5 MB before base64 encoding. If the image handling approach changes, update the UI limit, API validation, schema/storage approach, and these docs together.
