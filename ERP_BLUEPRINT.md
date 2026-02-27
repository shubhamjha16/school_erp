# School ERP Blueprint (Inspired by Schooleye-like Platforms)

This document defines a practical, implementation-first blueprint for building a full School ERP platform.

## 1) Product Vision

Build a cloud-based School ERP that unifies administration, academics, communication, operations, and finance in one secure platform for:
- School owners and management
- Principals and admins
- Teachers
- Students
- Parents
- Accountants and transport/inventory staff

## 2) User Roles & Permissions (RBAC)

Core roles:
- Super Admin (multi-school owner)
- School Admin
- Principal
- Teacher
- Class Teacher
- Student
- Parent/Guardian
- Accountant
- Librarian
- Transport Manager
- HR/Payroll Manager

Permission model:
- Role-based permission matrix
- Fine-grained feature flags (view/create/update/delete/approve/export)
- Campus-wise and class-wise data boundaries
- Audit log for sensitive operations

## 3) Core Feature Modules

### 3.1 Admission & Enquiry CRM
- Online enquiry capture form
- Lead pipeline (new, follow-up, converted, dropped)
- Student admission workflow with document upload
- Auto student ID generation
- Application fee management

### 3.2 Student Information System (SIS)
- Student profile (personal, academic, medical, documents)
- Parent/guardian profile and relation mapping
- Class/section assignment and promotion history
- House/group allocation
- Student lifecycle (active, transferred, alumni)

### 3.3 Academic Setup
- Academic years and terms/sessions
- Classes, sections, subjects, electives
- Curriculum mapping
- Teacher-subject assignment

### 3.4 Attendance
- Student attendance (daily/period-wise)
- Staff attendance
- Leave requests and approvals
- Attendance analytics and defaulter alerts
- Optional biometric/RFID integration hooks

### 3.5 Timetable & Substitution
- Weekly timetable generation
- Teacher workload balancing
- Auto/manual substitution management
- Clash detection

### 3.6 Homework, Assignments, Lesson Planning
- Homework publishing by subject/class
- File attachments and deadlines
- Student submissions and grading
- Lesson plans and syllabus progress tracking

### 3.7 Examination & Report Cards
- Exam templates (unit test, term, final)
- Marks/grades entry and moderation workflow
- Rules engine (weightage, rounding, passing criteria)
- Rank and percentile logic
- Report card generation (PDF/export)

### 3.8 Fee Management & Accounting
- Fee structures by class/category/route/hostel
- Invoice generation and due schedules
- Online/offline payment support
- Discounts, scholarships, concessions, penalties
- Receipts, ledger, trial balance, and reports

### 3.9 Transport
- Route and stop configuration
- Vehicle management and driver details
- Student route allocation
- GPS integration (future-ready API adapter)
- Transport fee linkage

### 3.10 Hostel (Optional)
- Room/bed allocation
- Hostel attendance and movement logs
- Hostel fee mapping

### 3.11 Library
- Book catalog and accessioning
- Issue/return with fines
- Inventory and stock alerts
- Student/staff borrowing rules

### 3.12 Inventory & Store
- Item masters and vendors
- Purchase and issue records
- Department-wise stock consumption
- Low stock alerts

### 3.13 HR & Payroll
- Employee master and contracts
- Leave types and balances
- Payroll cycles and salary components
- Payslips and statutory deductions

### 3.14 Communication Center
- Bulk SMS, email, in-app notifications
- Event announcements and reminders
- Triggered alerts (absent, fee due, exam schedule)

### 3.15 Parent/Student/Teacher Portals + Mobile App API
- Dashboard by role
- Homework, attendance, marks, fee status
- Communication inbox
- Profile and document access

### 3.16 Reports & Analytics
- Academic performance dashboards
- Fee collection and outstanding analytics
- Attendance trend and risk analysis
- Operational KPIs

## 4) Non-Functional Requirements

- Multi-tenant architecture (multi-school)
- Strong data isolation per school
- Horizontal scalability for high concurrent usage
- P95 API latency target under defined load
- Data encryption at rest and in transit
- Backup + disaster recovery strategy
- Structured logs and audit trails
- Localization and timezone support

## 5) Suggested Technical Architecture

## Frontend
- Web admin portal: React + TypeScript + component library
- Mobile apps: Flutter or React Native (consuming same APIs)

## Backend
- API: Node.js (NestJS) or Django/FastAPI (Python)
- Pattern: Modular monolith initially, evolve to services if required
- Auth: JWT + refresh tokens + optional SSO

## Database & Storage
- PostgreSQL (transactional core)
- Redis (caching/session/queues)
- Object storage (documents, images, report cards)

## Async/Integrations
- Queue worker (BullMQ/Celery)
- SMS/email/payment gateway adapters
- Webhook subsystem for external integrations

## DevOps
- Dockerized services
- CI/CD pipeline (test, lint, build, deploy)
- Cloud deployment (AWS/GCP/Azure)
- Monitoring: Prometheus/Grafana + centralized logs

## 6) Suggested Database Domain Model (High-Level)

Main entities:
- tenants, schools, campuses
- users, roles, permissions, user_roles
- students, guardians, student_guardians
- staff, departments, designations
- academic_years, terms, classes, sections, subjects
- enrollments, attendance_records
- exams, exam_components, marks, report_cards
- fee_heads, fee_structures, invoices, payments, receipts
- routes, vehicles, stops, route_allocations
- books, book_transactions
- leave_requests, payroll_runs, salary_slips
- notifications, templates, message_logs
- audit_logs

## 7) API Design Standards

- RESTful endpoints with versioning (`/api/v1`)
- OpenAPI/Swagger docs for all modules
- Consistent response envelope and error codes
- Idempotency keys for payment operations
- Pagination/filter/sort standards
- Webhook signing for outgoing events

## 8) Security Baseline

- RBAC + resource-level authorization checks
- Password hashing (Argon2/Bcrypt)
- Rate limiting + brute force protection
- CSRF protection where applicable
- Input validation and output encoding
- Audit trails for marks, fees, payroll, and user privilege changes
- Regular backup verification and key rotation

## 9) MVP Scope (Phase 1, 12-16 weeks)

Must-have modules:
1. Auth + RBAC
2. SIS (student/parent/staff profiles)
3. Academic setup (class/section/subject)
4. Attendance (student)
5. Exam + marks + report card
6. Fee management + receipts + basic accounting reports
7. Notifications (SMS/email)
8. Parent portal (attendance/marks/fees)

Out of MVP (Phase 2+):
- Full HR/payroll
- Advanced analytics
- Transport GPS live tracking
- Hostel and deep inventory workflows

## 10) Implementation Plan

### Sprint 0 (2 weeks)
- Product requirements, UI wireframes, data model finalization
- DevOps baseline, environments, CI/CD

### Sprint 1-2
- Auth, user management, RBAC
- Tenant/school onboarding

### Sprint 3-4
- SIS + academic setup
- Parent/student mappings

### Sprint 5-6
- Attendance + notifications
- Basic dashboard metrics

### Sprint 7-8
- Exam engine + marks + report cards

### Sprint 9-10
- Fee module + payment gateway integration

### Sprint 11-12
- Parent portal + hardening + UAT + go-live checklist

## 11) Acceptance Criteria (MVP)

- School can onboard staff, students, and parents
- Teachers can mark attendance and publish marks
- Parents can view attendance, marks, and fee dues
- Admin can generate invoices and receipts
- Audit logs available for critical actions
- Role-based access enforced and tested

## 12) Recommended Next Build Steps in This Repository

1. Initialize backend service (NestJS or Django/FastAPI)
2. Initialize web frontend (React + TypeScript)
3. Add shared API contracts (OpenAPI)
4. Create baseline migrations for core entities
5. Implement Auth + RBAC first
6. Add end-to-end smoke tests for login, attendance, marks, and fees

---
If you want, the next iteration can include:
- a complete folder structure,
- starter schema migrations,
- and scaffolded APIs for Auth, SIS, Attendance, Exams, and Fees.


## 13) Delivery Status (Implemented Incrementally)

- Sprint 1-2 (implemented):
  - Backend scaffold with FastAPI
  - Auth (register/login/me)
  - RBAC guard utilities
  - Tenant onboarding APIs
  - School onboarding APIs
  - Student create/list starter APIs
- Sprint 3-4 (implemented):
  - Academic setup APIs (academic years, classes, sections, subjects)
  - SIS guardian profiles and student-guardian mapping APIs
- Sprint 5-6 (implemented):
  - Student attendance APIs
  - Notification center APIs
  - Basic dashboard metrics API
- Sprint 7-8 (implemented):
  - Exams APIs
  - Student marks APIs
  - Report card generation and listing APIs
- Sprint 9-10 (implemented):
  - Fee invoice APIs
  - Fee payment and status update APIs
- Sprint 11-12 (implemented):
  - Parent portal student list API
  - Parent portal dashboard metrics API
  - Hardening validations for marks and payment mode
  - UAT checklist added
- Sprint 13-14 (implemented):
  - Async notification queue APIs
  - Audit logs and readiness ops APIs
  - Additional hardening hooks
  - Dockerfile and CI compile workflow
- Sprint 15+ (next):
  - Multi-tenant data isolation enforcement and external integrations

### Frontend Delivery Status (React + TypeScript + Vite)

- Sprint 0 (implemented):
  - Vite + React + TypeScript project scaffold
  - Design system: CSS tokens, global utilities
  - Reusable UI components: Button, Input, Card, Table, PageHeader
- Sprint 1-2 (implemented):
  - Login page with JWT stub auth flow
  - AdminLayout with collapsible sidebar, dark mode toggle, responsive design
  - Onboarding page: Tenant/School management with tabbed interface
- Sprint 3-4 (implemented):
  - Academics page: Academic Years, Classes, Sections, Subjects (tabbed)
  - SIS Guardians page: Guardian profiles with student-guardian mapping
  - SIS Students page: Student listing with enrollment management
- Sprint 5-6 (implemented):
  - Admin Dashboard: Metric cards, attendance trends, recent activity feed
  - Attendance page: Row-by-row toggle (Present/Absent/Late) per student
  - Communications page: SMS/Email/Push broadcast composer + message history
- Sprint 7-8 (implemented):
  - Exams page: Exam configuration + quick marks entry form
  - Report Cards page: 3-tab UI (Generate & Publish, Published History, Student Preview)
  - Subject-wise marks table with grade badges and rank display
- Sprint 9-10 (implemented):
  - Fees Collections page: Summary cards (Collected/Pending/Failed) + transaction table
  - Invoices page: Invoice generation with fee type breakdown + status tracking
- Sprint 11-12 (implemented):
  - ParentLayout: Separate green-themed portal with own sidebar
  - Parent Dashboard: Child metrics, recent updates feed, quick action buttons
  - My Children page: Profile cards with attendance/grades/fee status per child
- Sprint 13-14 (implemented):
  - Audit Logs page: Filterable activity log with severity/action badges
  - Notification Jobs page: Async delivery status with progress bars and error banners
  - Dockerfile (multi-stage: node build → nginx serve)
  - nginx.conf with SPA routing, API proxy, and static asset caching
  - .dockerignore for optimized build context
  - Production build verified: 0 errors, 1,785 modules, 87KB gzipped JS bundle
