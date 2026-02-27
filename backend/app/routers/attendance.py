from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import ensure_student_in_scope, get_current_user, get_user_school_ids, require_roles
from ..models import Student, StudentAttendance, StudentSchool, User
from ..schemas import AttendanceCreate, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/students", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def mark_student_attendance(
    payload: AttendanceCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("teacher", "school_admin", "principal")),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    ensure_student_in_scope(db, payload.student_id, user)

    if payload.status not in {"present", "absent", "late"}:
        raise HTTPException(status_code=400, detail="Invalid status")

    item = StudentAttendance(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return AttendanceOut(id=item.id, student_id=item.student_id, date=item.date, status=item.status)


@router.get("/students", response_model=list[AttendanceOut])
def list_student_attendance(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    school_ids = get_user_school_ids(db, user)
    q = db.query(StudentAttendance)
    if school_ids:
        q = (
            q.join(StudentSchool, StudentSchool.student_id == StudentAttendance.student_id)
            .filter(StudentSchool.school_id.in_(school_ids))
        )
    rows = q.order_by(StudentAttendance.id.asc()).all()
    return [AttendanceOut(id=r.id, student_id=r.student_id, date=r.date, status=r.status) for r in rows]
