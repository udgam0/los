import { AppShell } from "@/components/AppShell";
import { DocumentUploadForm } from "@/components/DocumentUploadForm";

export default function ApplicationDocumentsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Application documents
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Upload loan documents
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            Upload citizenship, salary, bank statement, and optional supporting documents
            for an existing loan application.
          </p>
          <DocumentUploadForm />
        </div>
      </section>
    </AppShell>
  );
}

