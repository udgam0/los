"use client";

import { FormEvent, useState } from "react";

type DocumentType =
  | "citizenship_document"
  | "salary_slip"
  | "bank_statement"
  | "supporting_document";

type UploadedDocument = {
  id: string;
  document_type: DocumentType;
  filename: string;
  content_type: string;
  file_hash: string;
  uploaded_at: string;
};

const documentOptions: Array<{
  value: DocumentType;
  label: string;
  required: boolean;
}> = [
  { value: "citizenship_document", label: "Citizenship document", required: true },
  { value: "salary_slip", label: "Salary slip", required: true },
  { value: "bank_statement", label: "Bank statement", required: true },
  { value: "supporting_document", label: "Optional supporting document", required: false }
];

export function DocumentUploadForm() {
  const [applicationId, setApplicationId] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("citizenship_document");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function validateForm() {
    if (!applicationId.trim()) {
      return "Application id is required.";
    }

    if (!file) {
      return "Choose a file to upload.";
    }

    if (file.size === 0) {
      return "Selected file cannot be empty.";
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Upload a PDF, JPEG, PNG, or WebP file.";
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

    if (!file) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("document_type", documentType);
      formData.append("file", file);

      const response = await fetch(
        `/api/applications/${encodeURIComponent(applicationId.trim())}/documents`,
        {
          method: "POST",
          body: formData
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? "Could not upload document.");
        return;
      }

      const uploaded = payload.document as UploadedDocument | undefined;
      if (!uploaded) {
        setError("Upload succeeded, but no document metadata was returned.");
        return;
      }

      setUploadedDocuments((current) => [uploaded, ...current]);
      setSuccess(`${labelForDocument(uploaded.document_type)} uploaded successfully.`);
      setFile(null);
      event.currentTarget.reset();
    } catch {
      setError("Could not reach the upload service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Application id</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
            onChange={(event) => setApplicationId(event.target.value)}
            placeholder="Paste your application id"
            required
            value={applicationId}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Document type</span>
          <select
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
            onChange={(event) => setDocumentType(event.target.value as DocumentType)}
            value={documentType}
          >
            {documentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">File</span>
          <input
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:font-semibold file:text-white"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
            type="file"
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

        <button
          className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Uploading document..." : "Upload document"}
        </button>
      </form>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold text-slate-950">Uploaded documents</h2>
        <div className="mt-4 space-y-3">
          {uploadedDocuments.length > 0 ? (
            uploadedDocuments.map((document) => (
              <article
                className="rounded-md border border-slate-200 bg-white p-4"
                key={document.id}
              >
                <p className="font-semibold text-slate-950">
                  {labelForDocument(document.document_type)}
                </p>
                <p className="mt-1 break-words text-sm text-slate-600">{document.filename}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(document.uploaded_at).toLocaleString()}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm leading-6 text-slate-600">
              Uploaded documents will appear here after each successful upload.
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700">Required documents</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {documentOptions.map((option) => (
              <li key={option.value}>
                {option.label}
                {option.required ? "" : " (optional)"}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function labelForDocument(documentType: DocumentType) {
  return (
    documentOptions.find((option) => option.value === documentType)?.label ??
    "Uploaded document"
  );
}

