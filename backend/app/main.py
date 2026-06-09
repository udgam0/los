from fastapi import FastAPI

from app.routes.health import router as health_router

app = FastAPI(
    title="Sajilo Loan API",
    description="Starter FastAPI app for the Sajilo Loan project.",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api", tags=["health"])


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Sajilo Loan API starter"}

