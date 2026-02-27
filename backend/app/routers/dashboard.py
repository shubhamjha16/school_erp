from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_roles
from ..models import Guardian, Notification, SchoolClass, Student, StudentAttendance, User
from ..schemas import DashboardMetricsOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetricsOut)
def get_metrics(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal", "super_admin")),
):
    total_students = db.query(Student).count()
    total_guardians = db.query(Guardian).count()
    total_classes = db.query(SchoolClass).count()
    attendance_marked = db.query(StudentAttendance).count()
    notifications_sent = db.query(Notification).count()

    return DashboardMetricsOut(
        total_students=total_students,
        total_guardians=total_guardians,
        total_classes=total_classes,
        attendance_marked=attendance_marked,
        notifications_sent=notifications_sent,
    )
