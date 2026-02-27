from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .database import get_db
from .models import StudentSchool, User, UserSchool
from .security import decode_access_token

bearer = HTTPBearer(auto_error=False)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    email = decode_access_token(creds.credentials)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    return user


def require_roles(*allowed: str):
    def role_checker(user: User = Depends(get_current_user)) -> User:
        role_names = {r.name for r in user.roles}
        if not role_names.intersection(set(allowed)):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return role_checker


def get_user_school_ids(db: Session, user: User) -> list[int]:
    role_names = {r.name for r in user.roles}
    if "super_admin" in role_names:
        return []

    school_ids = [row.school_id for row in db.query(UserSchool).filter(UserSchool.user_id == user.id).all()]
    if not school_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not mapped to any school")
    return school_ids


def ensure_student_in_scope(db: Session, student_id: int, user: User) -> None:
    school_ids = get_user_school_ids(db, user)
    if not school_ids:
        return

    exists = (
        db.query(StudentSchool)
        .filter(StudentSchool.student_id == student_id, StudentSchool.school_id.in_(school_ids))
        .first()
    )
    if not exists:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student is outside your school scope")
