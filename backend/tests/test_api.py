from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def ensure_school() -> int:
    root_email = "root-bootstrap@erp.com"
    client.post(
        "/api/v1/auth/register",
        json={
            "email": root_email,
            "full_name": "Root Bootstrap",
            "password": "secret123",
            "roles": ["super_admin"],
        },
    )
    login = client.post("/api/v1/auth/login", json={"email": root_email, "password": "secret123"})
    assert login.status_code == 200
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    client.post("/api/v1/onboarding/tenants", headers=headers, json={"name": "Bootstrap Tenant"})
    tenants = client.get("/api/v1/onboarding/tenants", headers=headers).json()
    tenant_id = tenants[0]["id"]

    client.post(
        "/api/v1/onboarding/schools",
        headers=headers,
        json={"tenant_id": tenant_id, "name": "Bootstrap School", "code": "BOOTSTRAP"},
    )
    schools = client.get("/api/v1/onboarding/schools", headers=headers).json()
    return schools[0]["id"]


def create_user_and_login(email: str, role: str, school_id: int | None = None) -> str:
    payload = {
        "email": email,
        "full_name": f"{role} user",
        "password": "secret123",
        "roles": [role],
    }
    if role != "super_admin":
        assert school_id is not None
        payload["school_ids"] = [school_id]

    client.post("/api/v1/auth/register", json=payload)
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "secret123"},
    )
    assert login_response.status_code == 200
    return login_response.json()["access_token"]


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_auth_and_student_flow():
    school_id = ensure_school()
    token = create_user_and_login("admin@school.com", "school_admin", school_id)
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/api/v1/students",
        headers=headers,
        json={
            "admission_no": "ADM-001",
            "full_name": "Student One",
            "class_name": "5",
            "section": "A",
        },
    )
    assert create_response.status_code in (201, 400)

    list_response = client.get("/api/v1/students", headers=headers)
    assert list_response.status_code == 200
    assert isinstance(list_response.json(), list)


def test_onboarding_tenant_and_school_flow():
    super_admin_token = create_user_and_login("root@erp.com", "super_admin")
    headers = {"Authorization": f"Bearer {super_admin_token}"}

    tenant_response = client.post("/api/v1/onboarding/tenants", headers=headers, json={"name": "Edu Group"})
    assert tenant_response.status_code in (201, 400)

    tenant_list = client.get("/api/v1/onboarding/tenants", headers=headers)
    assert tenant_list.status_code == 200
    assert len(tenant_list.json()) >= 1

    tenant_id = tenant_list.json()[0]["id"]
    school_response = client.post(
        "/api/v1/onboarding/schools",
        headers=headers,
        json={"tenant_id": tenant_id, "name": "Sunrise Public School", "code": "SPS001"},
    )
    assert school_response.status_code in (201, 400)

    school_list = client.get("/api/v1/onboarding/schools", headers=headers)
    assert school_list.status_code == 200
    assert len(school_list.json()) >= 1


def test_onboarding_forbidden_for_non_super_admin():
    school_id = ensure_school()
    teacher_token = create_user_and_login("teacher@school.com", "teacher", school_id)
    headers = {"Authorization": f"Bearer {teacher_token}"}

    response = client.post("/api/v1/onboarding/tenants", headers=headers, json={"name": "No Access Org"})
    assert response.status_code == 403


def test_sprint_3_4_academic_and_sis_flow():
    school_id = ensure_school()
    admin_token = create_user_and_login("admin2@school.com", "school_admin", school_id)
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    year_resp = client.post("/api/v1/academic/years", headers=admin_headers, json={"school_id": school_id, "name": "2025-26"})
    assert year_resp.status_code == 201

    class_resp = client.post("/api/v1/academic/classes", headers=admin_headers, json={"school_id": school_id, "name": "Grade 5"})
    assert class_resp.status_code == 201
    class_id = class_resp.json()["id"]

    assert client.post("/api/v1/academic/sections", headers=admin_headers, json={"class_id": class_id, "name": "A"}).status_code == 201
    assert client.post(
        "/api/v1/academic/subjects", headers=admin_headers, json={"class_id": class_id, "name": "Mathematics"}
    ).status_code == 201

    students = client.get("/api/v1/students", headers=admin_headers).json()
    if not students:
        client.post(
            "/api/v1/students",
            headers=admin_headers,
            json={"admission_no": "ADM-302", "full_name": "Riya Sharma", "class_name": "Grade 5", "section": "A"},
        )
        students = client.get("/api/v1/students", headers=admin_headers).json()

    student_id = students[0]["id"]
    guardian_resp = client.post(
        "/api/v1/sis/guardians",
        headers=admin_headers,
        json={"full_name": "Neha Sharma", "phone": "9999999999", "relation": "mother"},
    )
    assert guardian_resp.status_code == 201
    guardian_id = guardian_resp.json()["id"]

    map_resp = client.post(
        "/api/v1/sis/student-guardians",
        headers=admin_headers,
        json={"student_id": student_id, "guardian_id": guardian_id},
    )
    assert map_resp.status_code == 201


def test_sprint_5_6_attendance_notifications_and_dashboard():
    school_id = ensure_school()
    admin_token = create_user_and_login("admin56@school.com", "school_admin", school_id)
    teacher_token = create_user_and_login("teacher56@school.com", "teacher", school_id)

    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    students = client.get("/api/v1/students", headers=admin_headers).json()
    if not students:
        client.post(
            "/api/v1/students",
            headers=admin_headers,
            json={"admission_no": "ADM-560", "full_name": "Aman Verma", "class_name": "Grade 6", "section": "B"},
        )
        students = client.get("/api/v1/students", headers=admin_headers).json()

    student_id = students[0]["id"]

    attendance_resp = client.post(
        "/api/v1/attendance/students",
        headers=teacher_headers,
        json={"student_id": student_id, "date": "2026-01-10", "status": "present"},
    )
    assert attendance_resp.status_code == 201

    attendance_list_resp = client.get("/api/v1/attendance/students", headers=admin_headers)
    assert attendance_list_resp.status_code == 200
    assert len(attendance_list_resp.json()) >= 1

    notif_resp = client.post(
        "/api/v1/notifications",
        headers=admin_headers,
        json={
            "audience": "parents",
            "channel": "sms",
            "title": "Attendance Update",
            "message": "Your ward was present today.",
        },
    )
    assert notif_resp.status_code == 201

    notif_list_resp = client.get("/api/v1/notifications", headers=admin_headers)
    assert notif_list_resp.status_code == 200
    assert len(notif_list_resp.json()) >= 1

    metrics_resp = client.get("/api/v1/dashboard/metrics", headers=admin_headers)
    assert metrics_resp.status_code == 200
    body = metrics_resp.json()
    assert body["total_students"] >= 1
    assert body["attendance_marked"] >= 1
    assert body["notifications_sent"] >= 1


def test_sprint_7_8_exams_marks_report_cards():
    school_id = ensure_school()
    admin_token = create_user_and_login("admin78@school.com", "school_admin", school_id)
    teacher_token = create_user_and_login("teacher78@school.com", "teacher", school_id)

    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    students = client.get("/api/v1/students", headers=admin_headers).json()
    if not students:
        client.post(
            "/api/v1/students",
            headers=admin_headers,
            json={"admission_no": "ADM-780", "full_name": "Kabir Singh", "class_name": "Grade 8", "section": "A"},
        )
        students = client.get("/api/v1/students", headers=admin_headers).json()

    student_id = students[0]["id"]

    exam_resp = client.post(
        "/api/v1/exams",
        headers=admin_headers,
        json={"name": "Term 1", "academic_year": "2026-27"},
    )
    assert exam_resp.status_code == 201
    exam_id = exam_resp.json()["id"]

    mark_resp = client.post(
        "/api/v1/exams/marks",
        headers=teacher_headers,
        json={
            "student_id": student_id,
            "exam_id": exam_id,
            "subject": "Mathematics",
            "marks_obtained": 87,
            "max_marks": 100,
        },
    )
    assert mark_resp.status_code == 201

    report_resp = client.post(
        "/api/v1/exams/report-cards",
        headers=admin_headers,
        json={"student_id": student_id, "exam_id": exam_id},
    )
    assert report_resp.status_code == 201
    assert int(float(report_resp.json()["percentage"])) >= 0

    list_resp = client.get(f"/api/v1/exams/report-cards/{student_id}", headers=admin_headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1


def test_sprint_9_10_fee_invoices_and_payments():
    school_id = ensure_school()
    admin_token = create_user_and_login("admin910@school.com", "school_admin", school_id)
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    students = client.get("/api/v1/students", headers=admin_headers).json()
    if not students:
        client.post(
            "/api/v1/students",
            headers=admin_headers,
            json={"admission_no": "ADM-910", "full_name": "Meera Nair", "class_name": "Grade 9", "section": "A"},
        )
        students = client.get("/api/v1/students", headers=admin_headers).json()

    student_id = students[0]["id"]

    invoice_resp = client.post(
        "/api/v1/fees/invoices",
        headers=admin_headers,
        json={"student_id": student_id, "term": "Term 1", "amount_due": 50000, "status": "due"},
    )
    assert invoice_resp.status_code == 201
    invoice_id = invoice_resp.json()["id"]

    payment_resp = client.post(
        "/api/v1/fees/payments",
        headers=admin_headers,
        json={
            "invoice_id": invoice_id,
            "amount_paid": 50000,
            "payment_mode": "upi",
            "transaction_ref": "UPI-TXN-910",
        },
    )
    assert payment_resp.status_code == 201

    invoices_resp = client.get("/api/v1/fees/invoices", headers=admin_headers)
    assert invoices_resp.status_code == 200
    assert len(invoices_resp.json()) >= 1

    payments_resp = client.get("/api/v1/fees/payments", headers=admin_headers)
    assert payments_resp.status_code == 200
    assert len(payments_resp.json()) >= 1


def test_sprint_11_12_parent_portal_and_hardening():
    school_id = ensure_school()
    admin_token = create_user_and_login("admin1112@school.com", "school_admin", school_id)
    parent_token = create_user_and_login("parent1112@school.com", "parent", school_id)

    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    parent_headers = {"Authorization": f"Bearer {parent_token}"}

    students = client.get("/api/v1/students", headers=admin_headers).json()
    if not students:
        client.post(
            "/api/v1/students",
            headers=admin_headers,
            json={"admission_no": "ADM-1112", "full_name": "Ishita Rao", "class_name": "Grade 10", "section": "A"},
        )
        students = client.get("/api/v1/students", headers=admin_headers).json()
    student_id = students[0]["id"]

    guardian_resp = client.post(
        "/api/v1/sis/guardians",
        headers=admin_headers,
        json={"full_name": "Rohit Rao", "phone": "8888888888", "relation": "father"},
    )
    assert guardian_resp.status_code == 201
    guardian_id = guardian_resp.json()["id"]

    map_resp = client.post(
        "/api/v1/sis/student-guardians",
        headers=admin_headers,
        json={"student_id": student_id, "guardian_id": guardian_id},
    )
    assert map_resp.status_code == 201

    exam_resp = client.post(
        "/api/v1/exams",
        headers=admin_headers,
        json={"name": "Term 2", "academic_year": "2026-27"},
    )
    assert exam_resp.status_code == 201
    exam_id = exam_resp.json()["id"]

    bad_mark = client.post(
        "/api/v1/exams/marks",
        headers=admin_headers,
        json={"student_id": student_id, "exam_id": exam_id, "subject": "Science", "marks_obtained": 120, "max_marks": 100},
    )
    assert bad_mark.status_code == 400

    invoice_resp = client.post(
        "/api/v1/fees/invoices",
        headers=admin_headers,
        json={"student_id": student_id, "term": "Term 2", "amount_due": 42000, "status": "due"},
    )
    assert invoice_resp.status_code == 201

    bad_payment = client.post(
        "/api/v1/fees/payments",
        headers=admin_headers,
        json={"invoice_id": invoice_resp.json()["id"], "amount_paid": 1000, "payment_mode": "crypto", "transaction_ref": "BAD-1"},
    )
    assert bad_payment.status_code == 400

    student_list_resp = client.get(f"/api/v1/parent/students/{guardian_id}", headers=parent_headers)
    assert student_list_resp.status_code == 200
    assert len(student_list_resp.json()) >= 1

    dashboard_resp = client.get(f"/api/v1/parent/dashboard/{guardian_id}", headers=parent_headers)
    assert dashboard_resp.status_code == 200
    body = dashboard_resp.json()
    assert body["total_students"] >= 1


def test_sprint_13_14_async_notifications_ops_and_audit():
    school_id = ensure_school()
    admin_token = create_user_and_login("admin1314@school.com", "school_admin", school_id)
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    notif_resp = client.post(
        "/api/v1/notifications",
        headers=admin_headers,
        json={"audience": "parents", "channel": "email", "title": "PTM", "message": "PTM on Saturday"},
    )
    assert notif_resp.status_code == 201
    notif_id = notif_resp.json()["id"]

    queue_resp = client.post("/api/v1/notifications/queue", headers=admin_headers, json={"notification_id": notif_id})
    assert queue_resp.status_code == 201

    queue_list = client.get("/api/v1/notifications/queue", headers=admin_headers)
    assert queue_list.status_code == 200
    assert len(queue_list.json()) >= 1

    readiness = client.get("/api/v1/ops/readiness")
    assert readiness.status_code == 200
    assert readiness.json()["status"] == "ready"

    audit = client.get("/api/v1/ops/audit-logs", headers=admin_headers)
    assert audit.status_code == 200
    assert isinstance(audit.json(), list)
