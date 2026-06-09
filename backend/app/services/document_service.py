import hashlib
import re
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.document import (
    DocumentType,
    create_document_metadata,
    document_id_to_str,
)

DOCUMENTS_COLLECTION = "application_documents"
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
}


class EmptyUploadError(Exception):
    pass


class UnsupportedContentTypeError(Exception):
    pass


class FileStorageError(Exception):
    pass


class MetadataStorageError(Exception):
    pass


def sanitize_filename(filename: str) -> str:
    name = Path(filename or "document").name
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._")
    return name or "document"


def serialize_document(document: dict[str, Any]) -> dict[str, Any]:
    return document_id_to_str(document)


async def save_application_document(
    *,
    database: AsyncIOMotorDatabase,
    application_id: str,
    user_id: str,
    document_type: DocumentType,
    file: UploadFile,
    upload_dir: str,
) -> dict[str, Any]:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise UnsupportedContentTypeError

    original_filename = sanitize_filename(file.filename or "document")
    storage_dir = Path(upload_dir) / "applications" / application_id / document_type.value
    stored_filename = f"{uuid4().hex}_{original_filename}"
    file_path = storage_dir / stored_filename
    file_hash = hashlib.sha256()
    bytes_written = 0

    try:
        storage_dir.mkdir(parents=True, exist_ok=True)
        with file_path.open("wb") as destination:
            while chunk := await file.read(1024 * 1024):
                bytes_written += len(chunk)
                file_hash.update(chunk)
                destination.write(chunk)
    except OSError as error:
        raise FileStorageError from error
    finally:
        await file.close()

    if bytes_written == 0:
        file_path.unlink(missing_ok=True)
        raise EmptyUploadError

    metadata = create_document_metadata(
        application_id=application_id,
        user_id=user_id,
        document_type=document_type,
        filename=original_filename,
        file_path=str(file_path),
        content_type=file.content_type or "application/octet-stream",
        file_hash=file_hash.hexdigest(),
    )

    try:
        result = await database[DOCUMENTS_COLLECTION].insert_one(metadata)
    except Exception as error:
        file_path.unlink(missing_ok=True)
        raise MetadataStorageError from error

    metadata["_id"] = result.inserted_id
    return metadata

