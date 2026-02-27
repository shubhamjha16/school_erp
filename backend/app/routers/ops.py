from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_roles
from ..models import AuditLog, User
from ..schemas import AuditLogOut

router = APIRouter(prefix="/ops", tags=["ops"])


@router.get("/readiness")
def readiness():
    return {"status": "ready"}


@router.get("/audit-logs", response_model=list[AuditLogOut])
def list_audit_logs(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("super_admin", "school_admin", "principal")),
):
    rows = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(200).all()
    return [
        AuditLogOut(id=r.id, actor=r.actor, action=r.action, entity=r.entity, detail=r.detail)
        for r in rows
    ]
