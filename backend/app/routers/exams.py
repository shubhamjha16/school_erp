from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import Exam, ReportCard, Student, StudentMark, User
from ..schemas import (
    ExamCreate,
    ExamOut,
    ReportCardCreate,
    ReportCardOut,
    StudentMarkCreate,
    StudentMarkOut,
)

router = APIRouter(prefix="/exams", tags=["exams"])


@router.post("", response_model=ExamOut, status_code=status.HTTP_201_CREATED)
def create_exam(
    payload: ExamCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal")),
):
    exam = Exam(**payload.model_dump())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return ExamOut(id=exam.id, name=exam.name, academic_year=exam.academic_year)


@router.post("/marks", response_model=StudentMarkOut, status_code=status.HTTP_201_CREATED)
def add_mark(
    payload: StudentMarkCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("teacher", "school_admin", "principal")),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    exam = db.query(Exam).filter(Exam.id == payload.exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    mark = StudentMark(**payload.model_dump())
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return StudentMarkOut(
        id=mark.id,
        student_id=mark.student_id,
        exam_id=mark.exam_id,
        subject=mark.subject,
        marks_obtained=mark.marks_obtained,
        max_marks=mark.max_marks,
    )


@router.post("/report-cards", response_model=ReportCardOut, status_code=status.HTTP_201_CREATED)
def generate_report_card(
    payload: ReportCardCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal")),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    exam = db.query(Exam).filter(Exam.id == payload.exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    marks = db.query(StudentMark).filter(StudentMark.student_id == payload.student_id, StudentMark.exam_id == payload.exam_id).all()
    if not marks:
        raise HTTPException(status_code=400, detail="No marks found for student and exam")

    total_obtained = sum(m.marks_obtained for m in marks)
    total_max = sum(m.max_marks for m in marks)
    percentage = str(round((total_obtained / total_max) * 100, 2) if total_max else 0.0)

    existing = db.query(ReportCard).filter(ReportCard.student_id == payload.student_id, ReportCard.exam_id == payload.exam_id).first()
    if existing:
        existing.total_obtained = total_obtained
        existing.total_max = total_max
        existing.percentage = percentage
        db.commit()
        db.refresh(existing)
        return ReportCardOut(
            id=existing.id,
            student_id=existing.student_id,
            exam_id=existing.exam_id,
            total_obtained=existing.total_obtained,
            total_max=existing.total_max,
            percentage=existing.percentage,
        )

    report = ReportCard(
        student_id=payload.student_id,
        exam_id=payload.exam_id,
        total_obtained=total_obtained,
        total_max=total_max,
        percentage=percentage,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return ReportCardOut(
        id=report.id,
        student_id=report.student_id,
        exam_id=report.exam_id,
        total_obtained=report.total_obtained,
        total_max=report.total_max,
        percentage=report.percentage,
    )


@router.get("/report-cards/{student_id}", response_model=list[ReportCardOut])
def list_report_cards(
    student_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = db.query(ReportCard).filter(ReportCard.student_id == student_id).order_by(ReportCard.id.asc()).all()
    return [
        ReportCardOut(
            id=r.id,
            student_id=r.student_id,
            exam_id=r.exam_id,
            total_obtained=r.total_obtained,
            total_max=r.total_max,
            percentage=r.percentage,
        )
        for r in rows
    ]
