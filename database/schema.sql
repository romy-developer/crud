-- Employee table structure for PostgreSQL.
-- Safe to run when the employees table already exists.
CREATE TABLE IF NOT EXISTS public.employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(15),
    designation VARCHAR(100),
    department VARCHAR(80),
    employment_status VARCHAR(20) NOT NULL DEFAULT 'Active',
    gender VARCHAR(30),
    photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS department VARCHAR(80);
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS employment_status VARCHAR(20) NOT NULL DEFAULT 'Active';
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS gender VARCHAR(30);
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS photo TEXT;
