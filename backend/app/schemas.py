from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    roles: list[str] = ["teacher"]


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    roles: list[str]


class TenantCreate(BaseModel):
    name: str


class TenantOut(TenantCreate):
    id: int


class SchoolCreate(BaseModel):
    tenant_id: int
    name: str
    code: str


class SchoolOut(SchoolCreate):
    id: int


class StudentCreate(BaseModel):
    admission_no: str
    full_name: str
    class_name: str
    section: str


class StudentOut(StudentCreate):
    id: int
