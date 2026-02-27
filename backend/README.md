# School ERP Backend (MVP Foundation)

This backend initializes the first implementation slice of the ERP:
- FastAPI service
- JWT authentication
- Basic RBAC guards
- Tenant and school onboarding (Sprint 1-2 foundation)
- Academic setup APIs (Sprint 3-4)
- SIS guardian and student-guardian mapping APIs (Sprint 3-4)
- Attendance APIs (Sprint 5-6)
- Notification APIs (Sprint 5-6)
- Dashboard metrics API (Sprint 5-6)
- Exam and report card APIs (Sprint 7-8)
- Fee invoices and payment APIs (Sprint 9-10)
- Student module CRUD starter (create/list)
- SQLite persistence (for local development)

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run tests

```bash
cd backend
pytest
```

## API overview

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/onboarding/tenants` (super_admin)
- `GET /api/v1/onboarding/tenants` (super_admin)
- `POST /api/v1/onboarding/schools` (super_admin)
- `GET /api/v1/onboarding/schools` (super_admin)
- `POST /api/v1/academic/years` (school_admin/principal)
- `POST /api/v1/academic/classes` (school_admin/principal)
- `GET /api/v1/academic/classes` (school_admin/principal/teacher)
- `POST /api/v1/academic/sections` (school_admin/principal)
- `POST /api/v1/academic/subjects` (school_admin/principal)
- `POST /api/v1/sis/guardians` (school_admin/principal)
- `GET /api/v1/sis/guardians` (authenticated)
- `POST /api/v1/sis/student-guardians` (school_admin/principal)
- `GET /api/v1/sis/students/{student_id}/guardians` (authenticated)
- `POST /api/v1/attendance/students` (teacher/school_admin/principal)
- `GET /api/v1/attendance/students` (authenticated)
- `POST /api/v1/notifications` (school_admin/principal)
- `GET /api/v1/notifications` (authenticated)
- `GET /api/v1/dashboard/metrics` (school_admin/principal/super_admin)
- `POST /api/v1/exams` (school_admin/principal)
- `POST /api/v1/exams/marks` (teacher/school_admin/principal)
- `POST /api/v1/exams/report-cards` (school_admin/principal)
- `GET /api/v1/exams/report-cards/{student_id}` (authenticated)
- `POST /api/v1/fees/invoices` (school_admin/principal/accountant)
- `GET /api/v1/fees/invoices` (authenticated)
- `POST /api/v1/fees/payments` (school_admin/principal/accountant)
- `GET /api/v1/fees/payments` (authenticated)
- `POST /api/v1/students` (school_admin/principal)
- `GET /api/v1/students` (authenticated)
