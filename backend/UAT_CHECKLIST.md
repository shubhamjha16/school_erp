# Sprint 11-12 UAT Checklist

## Parent Portal
- [ ] Parent user can login and access parent endpoints
- [ ] Parent can fetch linked student list
- [ ] Parent can view dashboard metrics

## Security/Hardening
- [ ] Invalid marks (> max marks) are rejected
- [ ] Invalid payment modes are rejected
- [ ] Role checks block unauthorized role access

## Core Regression
- [ ] Auth register/login/me
- [ ] Student create/list
- [ ] Attendance mark/list
- [ ] Exams + report cards
- [ ] Fee invoice/payment

## Sprint 13-14 Ops/Deployment
- [ ] Notification queue can be enqueued and observed
- [ ] Readiness endpoint reports `ready`
- [ ] Audit logs visible to admin roles
- [ ] Docker build succeeds locally
- [ ] CI compile workflow passes
