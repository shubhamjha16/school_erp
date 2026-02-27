from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_roles
from ..models import FeeInvoice, Guardian, ReportCard, Student, StudentAttendance, StudentGuardian, User
from ..schemas import ParentDashboardOut, ParentStudentSummaryOut

router = APIRouter(prefix="/parent", tags=["parent_portal"])


@router.get("/students/{guardian_id}", response_model=list[ParentStudentSummaryOut])
def list_guardian_students(
    guardian_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("parent", "school_admin", "principal")),
):
    guardian = db.query(Guardian).filter(Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")

    rows = (
        db.query(Student)
        .join(StudentGuardian, Student.id == StudentGuardian.student_id)
        .filter(StudentGuardian.guardian_id == guardian_id)
        .order_by(Student.id.asc())
        .all()
    )

    return [
        ParentStudentSummaryOut(
            id=s.id,
            admission_no=s.admission_no,
            full_name=s.full_name,
            class_name=s.class_name,
            section=s.section,
        )
        for s in rows
    ]


@router.get("/dashboard/{guardian_id}", response_model=ParentDashboardOut)
def parent_dashboard(
    guardian_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("parent", "school_admin", "principal")),
):
    guardian = db.query(Guardian).filter(Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")

    links = db.query(StudentGuardian).filter(StudentGuardian.guardian_id == guardian_id).all()
    student_ids = [l.student_id for l in links]

    if not student_ids:
        return ParentDashboardOut(total_students=0, attendance_records=0, report_cards=0, fee_invoices=0, fee_due_count=0)

    attendance_records = db.query(StudentAttendance).filter(StudentAttendance.student_id.in_(student_ids)).count()
    report_cards = db.query(ReportCard).filter(ReportCard.student_id.in_(student_ids)).count()
    invoices = db.query(FeeInvoice).filter(FeeInvoice.student_id.in_(student_ids)).all()
    fee_due_count = sum(1 for i in invoices if i.status in {"due", "partial"})

    return ParentDashboardOut(
        total_students=len(student_ids),
        attendance_records=attendance_records,
        report_cards=report_cards,
        fee_invoices=len(invoices),
        fee_due_count=fee_due_count,
    )
