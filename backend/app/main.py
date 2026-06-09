from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.database import close_database_connection
from app.routes.applications import router as applications_router
from app.routes.auth import router as auth_router
from app.routes.health import router as health_router

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    close_database_connection()


app = FastAPI(
    title=settings.app_name,
    description="Starter FastAPI app for the Sajilo Loan project.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(health_router, tags=["health"])
app.include_router(auth_router)
app.include_router(applications_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Sajilo Loan API starter"}
