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


class StudentCreate(BaseModel):
    admission_no: str
    full_name: str
    class_name: str
    section: str


class StudentOut(StudentCreate):
    id: int
