from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.auth.dependencies import get_current_user
from app.config import get_settings
from app.database import get_database
from app.models.document import DocumentType
from app.models.user import UserRole
from app.schemas.application import ApplicationCreateRequest, ApplicationResponse
from app.schemas.document import DocumentResponse
from app.services.application_service import (
    ApplicationNotFoundError,
    ApplicationStatusError,
    create_draft_application,
    get_owned_application,
    list_customer_applications,
    serialize_application,
    submit_owned_application,
)
from app.services.document_service import (
    EmptyUploadError,
    FileStorageError,
    MetadataStorageError,
    UnsupportedContentTypeError,
    save_application_document,
    serialize_document,
)

router = APIRouter(prefix="/applications", tags=["applications"])
settings = get_settings()


def get_customer_id(current_user: dict) -> str:
    if current_user.get("role") != UserRole.CUSTOMER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access loan applications.",
        )

    user_id = current_user.get("_id") or current_user.get("id")
    if isinstance(user_id, ObjectId):
        return str(user_id)
    if isinstance(user_id, str) and user_id:
        return user_id

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authenticated user id is missing.",
    )


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_application(
    payload: ApplicationCreateRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> dict:
    applicant_id = get_customer_id(current_user)
    application = await create_draft_application(database, applicant_id, payload)
    return serialize_application(application)


@router.get("/my", response_model=list[ApplicationResponse])
async def read_my_applications(
    current_user: Annotated[dict, Depends(get_current_user)],
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> list[dict]:
    applicant_id = get_customer_id(current_user)
    applications = await list_customer_applications(database, applicant_id)
    return [serialize_application(application) for application in applications]


@router.get("/{application_id}", response_model=ApplicationResponse)
async def read_application(
    application_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> dict:
    applicant_id = get_customer_id(current_user)
    application = await get_owned_application(database, application_id, applicant_id)
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )
    return serialize_application(application)


@router.post("/{application_id}/submit", response_model=ApplicationResponse)
async def submit_application(
    application_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> dict:
    applicant_id = get_customer_id(current_user)
    try:
        application = await submit_owned_application(database, application_id, applicant_id)
    except ApplicationNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        ) from error
    except ApplicationStatusError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft applications can be submitted.",
        ) from error

    return serialize_application(application)


@router.post(
    "/{application_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_application_document(
    application_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    database: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    document_type: Annotated[DocumentType, Form(...)],
    file: Annotated[UploadFile, File(...)],
) -> dict:
    applicant_id = get_customer_id(current_user)
    application = await get_owned_application(database, application_id, applicant_id)
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    try:
        document = await save_application_document(
            database=database,
            application_id=application_id,
            user_id=applicant_id,
            document_type=document_type,
            file=file,
            upload_dir=settings.upload_dir,
        )
    except UnsupportedContentTypeError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Upload PDF, JPEG, PNG, or WebP files only.",
        ) from error
    except EmptyUploadError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file cannot be empty.",
        ) from error
    except FileStorageError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save uploaded file.",
        ) from error
    except MetadataStorageError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save document metadata.",
        ) from error

    return serialize_document(document)
