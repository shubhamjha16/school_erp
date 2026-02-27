from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import Guardian, Student, StudentGuardian, User
from ..schemas import GuardianCreate, GuardianOut, StudentGuardianMapCreate, StudentGuardianMapOut

router = APIRouter(prefix="/sis", tags=["sis"])


@router.post("/guardians", response_model=GuardianOut, status_code=status.HTTP_201_CREATED)
def create_guardian(
    payload: GuardianCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal")),
):
    guardian = Guardian(**payload.model_dump())
    db.add(guardian)
    db.commit()
    db.refresh(guardian)
    return GuardianOut(id=guardian.id, full_name=guardian.full_name, phone=guardian.phone, relation=guardian.relation)


@router.get("/guardians", response_model=list[GuardianOut])
def list_guardians(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = db.query(Guardian).order_by(Guardian.id.asc()).all()
    return [GuardianOut(id=r.id, full_name=r.full_name, phone=r.phone, relation=r.relation) for r in rows]


@router.post("/student-guardians", response_model=StudentGuardianMapOut, status_code=status.HTTP_201_CREATED)
def map_student_guardian(
    payload: StudentGuardianMapCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal")),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    guardian = db.query(Guardian).filter(Guardian.id == payload.guardian_id).first()
    if not guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")

    exists = (
        db.query(StudentGuardian)
        .filter(StudentGuardian.student_id == payload.student_id, StudentGuardian.guardian_id == payload.guardian_id)
        .first()
    )
    if exists:
        return StudentGuardianMapOut(student_id=payload.student_id, guardian_id=payload.guardian_id)

    link = StudentGuardian(student_id=payload.student_id, guardian_id=payload.guardian_id)
    db.add(link)
    db.commit()
    return StudentGuardianMapOut(student_id=payload.student_id, guardian_id=payload.guardian_id)


@router.get("/students/{student_id}/guardians", response_model=list[GuardianOut])
def list_student_guardians(
    student_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    _ = db.query(Student).filter(Student.id == student_id).first()

    rows = (
        db.query(Guardian)
        .join(StudentGuardian, Guardian.id == StudentGuardian.guardian_id)
        .filter(StudentGuardian.student_id == student_id)
        .order_by(Guardian.id.asc())
        .all()
    )
    return [GuardianOut(id=r.id, full_name=r.full_name, phone=r.phone, relation=r.relation) for r in rows]
