import Link from "next/link";

type AuthPanelProps = {
  mode: "login" | "register";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const isRegister = mode === "register";

  return (
    <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:py-16">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Secure access
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-slate-950 sm:text-5xl">
          {isRegister ? "Create your Sajilo Loan account" : "Welcome back to Sajilo Loan"}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          This is a frontend-only placeholder. Form data is not submitted yet, and backend
          authentication will be connected in a later phase.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">
          {isRegister ? "Register" : "Login"}
        </h2>
        <form className="mt-6 space-y-4">
          {isRegister ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
                placeholder="Aarav Sharma"
                type="text"
              />
            </label>
          ) : null}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email address</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
              placeholder="customer@example.com"
              type="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"
              placeholder="Enter password"
              type="password"
            />
          </label>
          {isRegister ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Account type</span>
              <select className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-600 focus:ring-2">
                <option>Customer</option>
                <option>Loan Officer</option>
                <option>Admin</option>
              </select>
            </label>
          ) : null}
          <button
            className="w-full rounded-md bg-emerald-700 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-800"
            type="button"
          >
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          {isRegister ? "Already have an account? " : "Need an account? "}
          <Link
            className="font-semibold text-emerald-700 hover:text-emerald-800"
            href={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </section>
    </div>
  );
}

