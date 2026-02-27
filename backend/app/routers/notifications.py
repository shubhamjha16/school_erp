from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import Notification, User
from ..schemas import NotificationCreate, NotificationOut

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("", response_model=NotificationOut, status_code=status.HTTP_201_CREATED)
def send_notification(
    payload: NotificationCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal")),
):
    if payload.channel not in {"sms", "email", "in_app"}:
        raise HTTPException(status_code=400, detail="Invalid channel")

    if payload.audience not in {"all", "parents", "students", "staff"}:
        raise HTTPException(status_code=400, detail="Invalid audience")

    item = Notification(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return NotificationOut(
        id=item.id,
        audience=item.audience,
        channel=item.channel,
        title=item.title,
        message=item.message,
    )


@router.get("", response_model=list[NotificationOut])
def list_notifications(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = db.query(Notification).order_by(Notification.id.asc()).all()
    return [
        NotificationOut(id=r.id, audience=r.audience, channel=r.channel, title=r.title, message=r.message)
        for r in rows
    ]
