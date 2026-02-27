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


class AcademicYearCreate(BaseModel):
    school_id: int
    name: str


class AcademicYearOut(AcademicYearCreate):
    id: int


class SchoolClassCreate(BaseModel):
    school_id: int
    name: str


class SchoolClassOut(SchoolClassCreate):
    id: int


class SectionCreate(BaseModel):
    class_id: int
    name: str


class SectionOut(SectionCreate):
    id: int


class SubjectCreate(BaseModel):
    class_id: int
    name: str


class SubjectOut(SubjectCreate):
    id: int


class StudentCreate(BaseModel):
    admission_no: str
    full_name: str
    class_name: str
    section: str


class StudentOut(StudentCreate):
    id: int


class GuardianCreate(BaseModel):
    full_name: str
    phone: str
    relation: str


class GuardianOut(GuardianCreate):
    id: int


class StudentGuardianMapCreate(BaseModel):
    student_id: int
    guardian_id: int


class StudentGuardianMapOut(StudentGuardianMapCreate):
    pass
