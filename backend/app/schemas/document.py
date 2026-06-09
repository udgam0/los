from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.document import DocumentType


class DocumentResponse(BaseModel):
    id: str
    application_id: str
    user_id: str
    document_type: DocumentType
    filename: str
    file_path: str
    content_type: str
    file_hash: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)

