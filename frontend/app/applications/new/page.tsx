import { AppShell } from "@/components/AppShell";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";

export default function NewApplicationPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Customer application
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Apply for a loan
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            Enter your financial and personal details to create a draft loan application.
            You can submit and upload supporting documents in later steps.
          </p>
          <LoanApplicationForm />
        </div>
      </section>
    </AppShell>
  );
}

