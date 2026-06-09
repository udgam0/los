import { AppShell } from "@/components/AppShell";
import { DashboardPlaceholder } from "@/components/DashboardPlaceholder";

const stats = [
  { label: "Users", value: "24" },
  { label: "Officers", value: "5" },
  { label: "Audit events", value: "128" },
  { label: "Open flags", value: "6" }
];

const actions = [
  {
    title: "Manage users",
    description: "Placeholder for customer, loan officer, and admin role management."
  },
  {
    title: "View audit logs",
    description: "Placeholder for sensitive workflow and security activity tracking."
  },
  {
    title: "Monitor system",
    description: "Placeholder for application volume, suspicious flags, and operational metrics."
  }
];

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <DashboardPlaceholder
        actions={actions}
        description="An administrative workspace for user oversight, audit history, and platform monitoring."
        role="Admin"
        stats={stats}
        title="System administration overview"
      />
    </AppShell>
  );
}

