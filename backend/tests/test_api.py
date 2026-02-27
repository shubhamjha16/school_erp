from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def create_user_and_login(email: str, role: str) -> str:
    client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "full_name": f"{role} user",
            "password": "secret123",
            "roles": [role],
        },
    )
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
    token = create_user_and_login("admin@school.com", "school_admin")
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
    teacher_token = create_user_and_login("teacher@school.com", "teacher")
    headers = {"Authorization": f"Bearer {teacher_token}"}

    response = client.post("/api/v1/onboarding/tenants", headers=headers, json={"name": "No Access Org"})
    assert response.status_code == 403
