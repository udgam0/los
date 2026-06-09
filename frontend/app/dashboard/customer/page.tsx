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
      <DashboardPlaceholder
        actions={actions}
        description="A customer-facing workspace for applying online, verifying OCR results, and following application progress."
        role="Customer"
        stats={stats}
        title="Your loan application workspace"
      />
    </AppShell>
  );
}

