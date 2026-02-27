from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, get_user_school_ids, require_roles
from ..models import Student, StudentSchool, User
from ..schemas import StudentCreate, StudentOut

router = APIRouter(prefix="/students", tags=["students"])


@router.post("", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal")),
):
    school_ids = get_user_school_ids(db, user)

    exists = db.query(Student).filter(Student.admission_no == payload.admission_no).first()
    if exists:
        raise HTTPException(status_code=400, detail="Admission number already exists")

    student = Student(**payload.model_dump())
    db.add(student)
    db.flush()

    # phase-15 start: each student belongs to one school scope for isolation
    db.add(StudentSchool(student_id=student.id, school_id=school_ids[0]))

    db.commit()
    db.refresh(student)
    return StudentOut(**student.__dict__)


@router.get("", response_model=list[StudentOut])
def list_students(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    school_ids = get_user_school_ids(db, user)
    if not school_ids:
        rows = db.query(Student).order_by(Student.id.asc()).all()
    else:
        rows = (
            db.query(Student)
            .join(StudentSchool, StudentSchool.student_id == Student.id)
            .filter(StudentSchool.school_id.in_(school_ids))
            .order_by(Student.id.asc())
            .all()
        )
    return [StudentOut(**s.__dict__) for s in rows]
