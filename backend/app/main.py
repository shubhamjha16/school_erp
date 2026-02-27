from fastapi import FastAPI

from .database import Base, engine
from .routers.auth import router as auth_router
from .routers.students import router as students_router
from .routers.onboarding import router as onboarding_router
from .routers.academic import router as academic_router
from .routers.sis import router as sis_router
from .routers.attendance import router as attendance_router
from .routers.notifications import router as notifications_router
from .routers.dashboard import router as dashboard_router
from .routers.exams import router as exams_router
from .routers.fees import router as fees_router

app = FastAPI(title="School ERP API", version="0.1.0")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth_router, prefix="/api/v1")
app.include_router(students_router, prefix="/api/v1")

app.include_router(onboarding_router, prefix="/api/v1")

app.include_router(academic_router, prefix="/api/v1")
app.include_router(sis_router, prefix="/api/v1")

app.include_router(attendance_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")

app.include_router(exams_router, prefix="/api/v1")

app.include_router(fees_router, prefix="/api/v1")
