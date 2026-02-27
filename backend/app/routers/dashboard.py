from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_user_school_ids, require_roles
from ..models import Guardian, Notification, SchoolClass, Student, StudentAttendance, StudentGuardian, StudentSchool, User
from ..schemas import DashboardMetricsOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetricsOut)
def get_metrics(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal", "super_admin")),
):
    school_ids = get_user_school_ids(db, user)

    if not school_ids:
        total_students = db.query(Student).count()
        total_guardians = db.query(Guardian).count()
        total_classes = db.query(SchoolClass).count()
        attendance_marked = db.query(StudentAttendance).count()
        notifications_sent = db.query(Notification).count()
    else:
        total_students = db.query(StudentSchool).filter(StudentSchool.school_id.in_(school_ids)).count()
        total_guardians = (
            db.query(Guardian)
            .join(StudentGuardian, StudentGuardian.guardian_id == Guardian.id)
            .join(StudentSchool, StudentSchool.student_id == StudentGuardian.student_id)
            .filter(StudentSchool.school_id.in_(school_ids))
            .distinct()
            .count()
        )
        total_classes = db.query(SchoolClass).filter(SchoolClass.school_id.in_(school_ids)).count()
        attendance_marked = (
            db.query(StudentAttendance)
            .join(StudentSchool, StudentSchool.student_id == StudentAttendance.student_id)
            .filter(StudentSchool.school_id.in_(school_ids))
            .count()
        )
        notifications_sent = db.query(Notification).count()

    return DashboardMetricsOut(
        total_students=total_students,
        total_guardians=total_guardians,
        total_classes=total_classes,
        attendance_marked=attendance_marked,
        notifications_sent=notifications_sent,
    )
