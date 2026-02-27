from fastapi import FastAPI

from .database import Base, engine
from .routers.auth import router as auth_router
from .routers.students import router as students_router
from .routers.onboarding import router as onboarding_router

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
