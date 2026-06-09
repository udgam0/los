import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { DashboardPlaceholder } from "@/components/DashboardPlaceholder";

const stats = [
  { label: "Applications", value: "1" },
  { label: "Documents", value: "3" },
  { label: "Current status", value: "Draft" },
  { label: "Updates", value: "0" }
];

const actions = [
  {
    title: "Continue application",
    description: "Placeholder for the customer loan form and supporting financial details."
  },
  {
    title: "Upload documents",
    description: "Placeholder for citizenship, salary slip, and bank statement upload."
  },
  {
    title: "Track status",
    description: "Placeholder for application progress and officer requests."
  }
];

export default function CustomerDashboardPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Customer dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Your loan application workspace
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              A customer-facing workspace for applying online, verifying OCR results,
              and following application progress.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="rounded-md bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
              href="/applications/new"
            >
              New application
            </Link>
            <Link
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 transition hover:bg-slate-100"
              href="/applications/documents"
            >
              Upload documents
            </Link>
          </div>
        </div>
      </section>
      <DashboardPlaceholder
        actions={actions}
        role="Customer"
        stats={stats}
        title="Application overview"
      />
    </AppShell>
  );
}
