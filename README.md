# Sajilo Loan

Sajilo Loan is a Digital Loan Origination System for Nepal's banks, cooperatives, and finance companies. This repository is currently a clean starter structure for a Next.js frontend and FastAPI backend.

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Database: MongoDB
- OCR: Tesseract OCR
- Authentication: JWT
- Roles: Customer, Loan Officer, Admin

## Project Structure
```text
los/
  frontend/          Next.js TypeScript app
  backend/           FastAPI app
  AGENTS.md          Agent guidance for future development
  ROADMAP.md         Project roadmap
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend development server will run at:

```text
http://localhost:3000
```

Starter frontend routes:

```text
/                   Home page
/login              Login page
/register           Register page
/dashboard/customer Customer dashboard placeholder
/dashboard/officer  Officer dashboard placeholder
/dashboard/admin    Admin dashboard placeholder
/applications/new   Customer loan application form
/applications/documents Customer document upload page
```

Frontend auth proxy:

```text
SAJILO_API_BASE_URL=http://127.0.0.1:8000
```

The frontend login and register pages call Next.js API routes under `/api/auth/*`.
Those route handlers forward requests to FastAPI and store the JWT in an HTTP-only
cookie.

## Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend API will run at:

```text
http://localhost:8000
```

FastAPI docs will be available at:

```text
http://localhost:8000/docs
```

Health check:

```text
GET http://localhost:8000/health
```

Auth endpoints:

```text
POST http://localhost:8000/auth/register
POST http://localhost:8000/auth/login
GET  http://localhost:8000/auth/me
```

Customer application endpoints:

```text
POST http://localhost:8000/applications
GET  http://localhost:8000/applications/my
GET  http://localhost:8000/applications/{application_id}
POST http://localhost:8000/applications/{application_id}/submit
POST http://localhost:8000/applications/{application_id}/documents
```

Document upload uses multipart form data with one file per request:

```text
document_type=citizenship_document | salary_slip | bank_statement | supporting_document
file=<PDF, JPEG, PNG, or WebP file>
```

## Current Status
This repository contains only starter structure and basic framework files. Full product features such as loan applications, OCR processing, JWT authentication, MongoDB persistence, scoring, dashboards, and audit logs have not been implemented yet.
