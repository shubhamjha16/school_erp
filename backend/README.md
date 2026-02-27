# School ERP Backend (MVP Foundation)

This backend initializes the first implementation slice of the ERP:
- FastAPI service
- JWT authentication
- Basic RBAC guards
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
- `POST /api/v1/students` (school_admin/principal)
- `GET /api/v1/students` (authenticated)
