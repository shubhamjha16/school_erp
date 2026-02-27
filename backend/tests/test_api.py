from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_auth_and_student_flow():
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin@school.com",
            "full_name": "Admin User",
            "password": "secret123",
            "roles": ["school_admin"],
        },
    )
    assert register_response.status_code in (201, 400)

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@school.com", "password": "secret123"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
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
