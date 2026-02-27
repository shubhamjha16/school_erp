from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_user_school_ids, require_roles
from ..models import AcademicYear, School, SchoolClass, Section, Subject, User
from ..schemas import (
    AcademicYearCreate,
    AcademicYearOut,
    SchoolClassCreate,
    SchoolClassOut,
    SectionCreate,
    SectionOut,
    SubjectCreate,
    SubjectOut,
)

router = APIRouter(prefix="/academic", tags=["academic"])


def _ensure_school_scope(db: Session, user: User, school_id: int) -> None:
    school_ids = get_user_school_ids(db, user)
    if school_ids and school_id not in school_ids:
        raise HTTPException(status_code=403, detail="School outside your scope")


@router.post("/years", response_model=AcademicYearOut, status_code=status.HTTP_201_CREATED)
def create_academic_year(
    payload: AcademicYearCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal")),
):
    school = db.query(School).filter(School.id == payload.school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    _ensure_school_scope(db, user, payload.school_id)

    item = AcademicYear(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return AcademicYearOut(id=item.id, school_id=item.school_id, name=item.name)


@router.post("/classes", response_model=SchoolClassOut, status_code=status.HTTP_201_CREATED)
def create_class(
    payload: SchoolClassCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal")),
):
    school = db.query(School).filter(School.id == payload.school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    _ensure_school_scope(db, user, payload.school_id)

    item = SchoolClass(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return SchoolClassOut(id=item.id, school_id=item.school_id, name=item.name)


@router.post("/sections", response_model=SectionOut, status_code=status.HTTP_201_CREATED)
def create_section(
    payload: SectionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal")),
):
    cls = db.query(SchoolClass).filter(SchoolClass.id == payload.class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    _ensure_school_scope(db, user, cls.school_id)

    item = Section(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return SectionOut(id=item.id, class_id=item.class_id, name=item.name)


@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(
    payload: SubjectCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal")),
):
    cls = db.query(SchoolClass).filter(SchoolClass.id == payload.class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    _ensure_school_scope(db, user, cls.school_id)

    item = Subject(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return SubjectOut(id=item.id, class_id=item.class_id, name=item.name)


@router.get("/classes", response_model=list[SchoolClassOut])
def list_classes(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("school_admin", "principal", "teacher")),
):
    school_ids = get_user_school_ids(db, user)
    q = db.query(SchoolClass)
    if school_ids:
        q = q.filter(SchoolClass.school_id.in_(school_ids))
    rows = q.order_by(SchoolClass.id.asc()).all()
    return [SchoolClassOut(id=r.id, school_id=r.school_id, name=r.name) for r in rows]
