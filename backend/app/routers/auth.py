from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Role, School, User, UserSchool
from ..schemas import LoginRequest, RegisterRequest, Token, UserOut
from ..security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already exists")

    role_objs = []
    for role_name in payload.roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
            db.flush()
        role_objs.append(role)

    roles = set(payload.roles)
    school_scoped_roles = {"school_admin", "principal", "teacher", "parent", "accountant"}
    if roles.intersection(school_scoped_roles) and not payload.school_ids:
        raise HTTPException(status_code=400, detail="school_ids is required for school-scoped roles")

    school_ids = sorted(set(payload.school_ids))
    if school_ids:
        found = db.query(School.id).filter(School.id.in_(school_ids)).all()
        found_ids = {row[0] for row in found}
        missing = [sid for sid in school_ids if sid not in found_ids]
        if missing:
            raise HTTPException(status_code=404, detail=f"School not found: {missing[0]}")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        roles=role_objs,
    )
    db.add(user)
    db.flush()

    for sid in school_ids:
        db.add(UserSchool(user_id=user.id, school_id=sid))

    db.commit()
    db.refresh(user)
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        roles=[r.name for r in user.roles],
        school_ids=school_ids,
    )


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(user.email)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    school_ids = [row.school_id for row in db.query(UserSchool).filter(UserSchool.user_id == user.id).all()]
    return UserOut(id=user.id, email=user.email, full_name=user.full_name, roles=[r.name for r in user.roles], school_ids=school_ids)
