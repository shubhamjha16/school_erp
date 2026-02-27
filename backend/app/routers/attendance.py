from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import Student, StudentAttendance, User
from ..schemas import AttendanceCreate, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/students", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def mark_student_attendance(
    payload: AttendanceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("teacher", "school_admin", "principal")),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

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
    _: User = Depends(get_current_user),
):
    rows = db.query(StudentAttendance).order_by(StudentAttendance.id.asc()).all()
    return [AttendanceOut(id=r.id, student_id=r.student_id, date=r.date, status=r.status) for r in rows]
