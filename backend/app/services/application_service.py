from datetime import UTC, datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from app.models.application import (
    ApplicationStatus,
    application_id_to_str,
    create_application_document,
)
from app.schemas.application import ApplicationCreateRequest

APPLICATIONS_COLLECTION = "loan_applications"


class ApplicationNotFoundError(Exception):
    pass


class ApplicationStatusError(Exception):
    pass


def serialize_application(document: dict[str, Any]) -> dict[str, Any]:
    return application_id_to_str(document)


async def create_draft_application(
    database: AsyncIOMotorDatabase,
    applicant_id: str,
    payload: ApplicationCreateRequest,
) -> dict[str, Any]:
    document = create_application_document(applicant_id=applicant_id, payload=payload)
    result = await database[APPLICATIONS_COLLECTION].insert_one(document)
    document["_id"] = result.inserted_id
    return document


async def list_customer_applications(
    database: AsyncIOMotorDatabase,
    applicant_id: str,
) -> list[dict[str, Any]]:
    cursor = database[APPLICATIONS_COLLECTION].find({"applicant_id": applicant_id}).sort(
        "created_at",
        -1,
    )
    return [document async for document in cursor]


async def get_owned_application(
    database: AsyncIOMotorDatabase,
    application_id: str,
    applicant_id: str,
) -> dict[str, Any] | None:
    if not ObjectId.is_valid(application_id):
        return None

    return await database[APPLICATIONS_COLLECTION].find_one(
        {
            "_id": ObjectId(application_id),
            "applicant_id": applicant_id,
        }
    )


async def submit_owned_application(
    database: AsyncIOMotorDatabase,
    application_id: str,
    applicant_id: str,
) -> dict[str, Any]:
    application = await get_owned_application(database, application_id, applicant_id)
    if application is None:
        raise ApplicationNotFoundError

    if application.get("status") != ApplicationStatus.DRAFT.value:
        raise ApplicationStatusError

    updated_application = await database[APPLICATIONS_COLLECTION].find_one_and_update(
        {
            "_id": application["_id"],
            "applicant_id": applicant_id,
        },
        {
            "$set": {
                "status": ApplicationStatus.SUBMITTED.value,
                "updated_at": datetime.now(UTC),
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if updated_application is None:
        raise ApplicationNotFoundError
    return updated_application

