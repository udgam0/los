"use client";

import { FormEvent, useState } from "react";

type ApplicationResponse = {
  id: string;
  status: string;
};

const employmentOptions = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self-employed" },
  { value: "business", label: "Business" },
  { value: "contract", label: "Contract" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" }
];

const savingsOptions = [
  { value: "good", label: "Good savings buffer" },
  { value: "average", label: "Average savings buffer" },
  { value: "low", label: "Low savings buffer" }
];

const repaymentOptions = [
  { value: "no_previous_default", label: "No previous default" },
  { value: "minor_late_payment", label: "Minor late payment" },
  { value: "previous_default", label: "Previous default" }
];

const initialForm = {
  full_name: "",
  citizenship_number: "",
  phone: "",
  address: "",
  monthly_income: "",
  employment_type: "salaried",
  existing_monthly_debt: "0",
  requested_loan_amount: "",
  loan_duration_months: "",
  loan_purpose: "",
  dependents: "0",
  savings_buffer: "average",
  repayment_history: "no_previous_default"
};

type FormState = typeof initialForm;

export function LoanApplicationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validateForm() {
    if (form.full_name.trim().length < 2) {
      return "Full name must be at least 2 characters.";
    }
    if (form.citizenship_number.trim().length < 3) {
      return "Citizenship number is required.";
    }
    if (form.phone.trim().length < 7) {
      return "Enter a valid phone number.";
    }
    if (form.address.trim().length < 3) {
      return "Address must be at least 3 characters.";
    }
    if (Number(form.monthly_income) <= 0) {
      return "Monthly income must be greater than 0.";
    }
    if (Number(form.existing_monthly_debt) < 0) {
      return "Existing monthly debt cannot be negative.";
    }
    if (Number(form.requested_loan_amount) <= 0) {
      return "Requested loan amount must be greater than 0.";
    }
    const duration = Number(form.loan_duration_months);
    if (!Number.isInteger(duration) || duration < 1 || duration > 360) {
      return "Loan duration must be between 1 and 360 months.";
    }
    if (form.loan_purpose.trim().length < 3) {
      return "Loan purpose must be at least 3 characters.";
    }
    const dependents = Number(form.dependents);
    if (!Number.isInteger(dependents) || dependents < 0) {
      return "Number of dependents cannot be negative.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          citizenship_number: form.citizenship_number.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          monthly_income: Number(form.monthly_income),
          employment_type: form.employment_type,
          existing_monthly_debt: Number(form.existing_monthly_debt),
          requested_loan_amount: Number(form.requested_loan_amount),
          loan_duration_months: Number(form.loan_duration_months),
          loan_purpose: form.loan_purpose.trim(),
          dependents: Number(form.dependents),
          savings_buffer: form.savings_buffer,
          repayment_history: form.repayment_history
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? "Could not create loan application.");
        return;
      }

      const application = payload.application as ApplicationResponse | undefined;
      setSuccess(
        `Application saved as ${application?.status ?? "draft"}. Reference: ${
          application?.id ?? "created"
        }.`
      );
      setForm(initialForm);
    } catch {
      setError("Could not reach the application service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 lg:grid-cols-2">
        <TextField
          label="Full name"
          name="full_name"
          onChange={updateField}
          placeholder="Aarav Sharma"
          value={form.full_name}
        />
        <TextField
          label="Citizenship number"
          name="citizenship_number"
          onChange={updateField}
          placeholder="12-34-56-78901"
          value={form.citizenship_number}
        />
        <TextField
          label="Phone"
          name="phone"
          onChange={updateField}
          placeholder="+977 9800000000"
          type="tel"
          value={form.phone}
        />
        <TextField
          label="Address"
          name="address"
          onChange={updateField}
          placeholder="Kathmandu, Nepal"
          value={form.address}
        />
        <TextField
          label="Monthly income"
          name="monthly_income"
          onChange={updateField}
          placeholder="75000"
          type="number"
          value={form.monthly_income}
        />
        <SelectField
          label="Employment type"
          name="employment_type"
          onChange={updateField}
          options={employmentOptions}
          value={form.employment_type}
        />
        <TextField
          label="Existing monthly debt"
          name="existing_monthly_debt"
          onChange={updateField}
          placeholder="12000"
          type="number"
          value={form.existing_monthly_debt}
        />
        <TextField
          label="Requested loan amount"
          name="requested_loan_amount"
          onChange={updateField}
          placeholder="800000"
          type="number"
          value={form.requested_loan_amount}
        />
        <TextField
          label="Loan duration in months"
          name="loan_duration_months"
          onChange={updateField}
          placeholder="60"
          type="number"
          value={form.loan_duration_months}
        />
        <TextField
          label="Number of dependents"
          name="dependents"
          onChange={updateField}
          placeholder="2"
          type="number"
          value={form.dependents}
        />
        <SelectField
          label="Savings buffer"
          name="savings_buffer"
          onChange={updateField}
          options={savingsOptions}
          value={form.savings_buffer}
        />
        <SelectField
          label="Repayment history"
          name="repayment_history"
          onChange={updateField}
          options={repaymentOptions}
          value={form.repayment_history}
        />
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Loan purpose</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
          maxLength={300}
          minLength={3}
          onChange={(event) => updateField("loan_purpose", event.target.value)}
          placeholder="Describe why you need this loan"
          required
          value={form.loan_purpose}
        />
      </label>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          This creates a draft application. Submission and document upload are separate steps.
        </p>
        <button
          className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Saving application..." : "Save application"}
        </button>
      </div>
    </form>
  );
}

type FieldName = keyof FormState;

type TextFieldProps = {
  label: string;
  name: FieldName;
  onChange: (name: FieldName, value: string) => void;
  placeholder: string;
  type?: "text" | "tel" | "number";
  value: string;
};

function TextField({
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
        min={type === "number" ? 0 : undefined}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: FieldName;
  onChange: (name: FieldName, value: string) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
};

function SelectField({ label, name, onChange, options, value }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
        onChange={(event) => onChange(name, event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

