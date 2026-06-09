from datetime import UTC, datetime
from enum import StrEnum
from typing import Any

from bson import ObjectId


class ApplicationStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"


class EmploymentType(StrEnum):
    SALARIED = "salaried"
    SELF_EMPLOYED = "self_employed"
    BUSINESS = "business"
    CONTRACT = "contract"
    UNEMPLOYED = "unemployed"
    OTHER = "other"


class SavingsBuffer(StrEnum):
    GOOD = "good"
    AVERAGE = "average"
    LOW = "low"


class RepaymentHistory(StrEnum):
    NO_PREVIOUS_DEFAULT = "no_previous_default"
    MINOR_LATE_PAYMENT = "minor_late_payment"
    PREVIOUS_DEFAULT = "previous_default"


def create_application_document(
    *,
    applicant_id: str,
    payload: Any,
) -> dict[str, Any]:
    now = datetime.now(UTC)
    return {
        "applicant_id": applicant_id,
        "full_name": payload.full_name.strip(),
        "citizenship_number": payload.citizenship_number.strip(),
        "phone": payload.phone.strip(),
        "address": payload.address.strip(),
        "monthly_income": payload.monthly_income,
        "employment_type": payload.employment_type.value,
        "existing_monthly_debt": payload.existing_monthly_debt,
        "requested_loan_amount": payload.requested_loan_amount,
        "loan_duration_months": payload.loan_duration_months,
        "loan_purpose": payload.loan_purpose.strip(),
        "dependents": payload.dependents,
        "savings_buffer": payload.savings_buffer.value,
        "repayment_history": payload.repayment_history.value,
        "status": ApplicationStatus.DRAFT.value,
        "created_at": now,
        "updated_at": now,
    }


def application_id_to_str(document: dict[str, Any]) -> dict[str, Any]:
    document = document.copy()
    if isinstance(document.get("_id"), ObjectId):
        document["id"] = str(document.pop("_id"))
    return document

