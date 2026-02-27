from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_roles
from ..models import School, Tenant, User
from ..schemas import SchoolCreate, SchoolOut, TenantCreate, TenantOut

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("/tenants", response_model=TenantOut, status_code=status.HTTP_201_CREATED)
def create_tenant(
    payload: TenantCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("super_admin")),
):
    exists = db.query(Tenant).filter(Tenant.name == payload.name).first()
    if exists:
        raise HTTPException(status_code=400, detail="Tenant already exists")

    tenant = Tenant(name=payload.name)
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return TenantOut(id=tenant.id, name=tenant.name)


@router.get("/tenants", response_model=list[TenantOut])
def list_tenants(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("super_admin")),
):
    rows = db.query(Tenant).order_by(Tenant.id.asc()).all()
    return [TenantOut(id=t.id, name=t.name) for t in rows]


@router.post("/schools", response_model=SchoolOut, status_code=status.HTTP_201_CREATED)
def create_school(
    payload: SchoolCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("super_admin")),
):
    tenant = db.query(Tenant).filter(Tenant.id == payload.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    code_exists = db.query(School).filter(School.code == payload.code).first()
    if code_exists:
        raise HTTPException(status_code=400, detail="School code already exists")

    school = School(**payload.model_dump())
    db.add(school)
    db.commit()
    db.refresh(school)
    return SchoolOut(id=school.id, tenant_id=school.tenant_id, name=school.name, code=school.code)


@router.get("/schools", response_model=list[SchoolOut])
def list_schools(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("super_admin")),
):
    rows = db.query(School).order_by(School.id.asc()).all()
    return [SchoolOut(id=s.id, tenant_id=s.tenant_id, name=s.name, code=s.code) for s in rows]
