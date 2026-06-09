import Link from "next/link";

import { AppShell } from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Sajilo Loan
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 sm:text-6xl">
            Digital loan applications for Nepal's financial institutions
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            A responsive frontend starter for customer applications, officer reviews,
            OCR verification, risk scoring, and admin oversight.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="rounded-md bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
              href="/register"
            >
              Start application
            </Link>
            <Link
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 transition hover:bg-slate-100"
              href="/login"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">MVP workflow preview</h2>
          <div className="mt-5 space-y-4">
            {[
              "Customer submits application",
              "Documents are uploaded for OCR review",
              "Loan officer reviews risk and flags",
              "Admin monitors users and audit logs"
            ].map((item, index) => (
              <div key={item} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-sm font-bold text-emerald-800">
                  {index + 1}
                </span>
                <p className="pt-1 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
