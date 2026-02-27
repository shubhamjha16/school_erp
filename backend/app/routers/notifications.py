from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import AuditLog, Notification, NotificationDispatch, User
from ..schemas import (
    NotificationCreate,
    NotificationDispatchCreate,
    NotificationDispatchOut,
    NotificationOut,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _mark_sent(dispatch_id: int, db: Session) -> None:
    row = db.query(NotificationDispatch).filter(NotificationDispatch.id == dispatch_id).first()
    if row:
        row.status = "sent"
        db.add(AuditLog(actor="system", action="notification_sent", entity="notification_dispatch", detail=str(dispatch_id)))
        db.commit()


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
    db.add(AuditLog(actor="admin", action="notification_created", entity="notification", detail=payload.title))
    db.commit()
    db.refresh(item)
    return NotificationOut(
        id=item.id,
        audience=item.audience,
        channel=item.channel,
        title=item.title,
        message=item.message,
    )


@router.post("/queue", response_model=NotificationDispatchOut, status_code=status.HTTP_201_CREATED)
def queue_notification(
    payload: NotificationDispatchCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal")),
):
    notification = db.query(Notification).filter(Notification.id == payload.notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    dispatch = NotificationDispatch(notification_id=payload.notification_id, status="queued")
    db.add(dispatch)
    db.add(AuditLog(actor="admin", action="notification_queued", entity="notification_dispatch", detail=str(payload.notification_id)))
    db.commit()
    db.refresh(dispatch)

    background_tasks.add_task(_mark_sent, dispatch.id, db)
    return NotificationDispatchOut(id=dispatch.id, notification_id=dispatch.notification_id, status=dispatch.status)


@router.get("/queue", response_model=list[NotificationDispatchOut])
def list_queue(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = db.query(NotificationDispatch).order_by(NotificationDispatch.id.asc()).all()
    return [NotificationDispatchOut(id=r.id, notification_id=r.notification_id, status=r.status) for r in rows]


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
