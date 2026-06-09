from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.auth.dependencies import get_current_user
from app.auth.security import create_access_token, verify_password
from app.database import get_database
from app.schemas.user import TokenResponse, UserLoginRequest, UserRegisterRequest, UserResponse
from app.services.user_service import (
    DuplicateUserError,
    create_customer_user,
    get_user_by_email,
    serialize_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_user(
    payload: UserRegisterRequest,
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> dict:
    try:
        user = await create_customer_user(database, payload)
    except DuplicateUserError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with this {error.field} already exists",
        ) from error

    return serialize_user(user)


@router.post("/login", response_model=TokenResponse)
async def login_user(
    payload: UserLoginRequest,
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> dict:
    user = await get_user_by_email(database, payload.email)
    password_hash = user.get("password_hash") if user else None
    if (
        user is None
        or not isinstance(password_hash, str)
        or not verify_password(payload.password, password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    public_user = serialize_user(user)
    return {
        "access_token": create_access_token(public_user["id"]),
        "token_type": "bearer",
        "user": public_user,
    }


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> dict:
    return serialize_user(current_user)
