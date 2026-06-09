from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.application import (
    ApplicationStatus,
    EmploymentType,
    RepaymentHistory,
    SavingsBuffer,
)


class ApplicationCreateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    citizenship_number: str = Field(..., min_length=3, max_length=40)
    phone: str = Field(..., min_length=7, max_length=20)
    address: str = Field(..., min_length=3, max_length=200)
    monthly_income: float = Field(..., gt=0)
    employment_type: EmploymentType
    existing_monthly_debt: float = Field(..., ge=0)
    requested_loan_amount: float = Field(..., gt=0)
    loan_duration_months: int = Field(..., ge=1, le=360)
    loan_purpose: str = Field(..., min_length=3, max_length=300)
    dependents: int = Field(..., ge=0)
    savings_buffer: SavingsBuffer
    repayment_history: RepaymentHistory

    @field_validator(
        "full_name",
        "citizenship_number",
        "phone",
        "address",
        "loan_purpose",
    )
    @classmethod
    def strip_and_require_value(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Value cannot be empty")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        allowed = set("0123456789+-() ")
        if any(character not in allowed for character in value):
            raise ValueError("Phone can contain only digits, spaces, +, -, (, and )")
        return value


class ApplicationResponse(BaseModel):
    id: str
    applicant_id: str
    full_name: str
    citizenship_number: str
    phone: str
    address: str
    monthly_income: float
    employment_type: EmploymentType
    existing_monthly_debt: float
    requested_loan_amount: float
    loan_duration_months: int
    loan_purpose: str
    dependents: int
    savings_buffer: SavingsBuffer
    repayment_history: RepaymentHistory
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

