import { AppShell } from "@/components/AppShell";
import { DashboardPlaceholder } from "@/components/DashboardPlaceholder";

const stats = [
  { label: "Pending reviews", value: "8" },
  { label: "Flagged files", value: "2" },
  { label: "Requests sent", value: "4" },
  { label: "Approved today", value: "1" }
];

const actions = [
  {
    title: "Review applications",
    description: "Placeholder for submitted applications with OCR and applicant details."
  },
  {
    title: "Assess risk",
    description: "Placeholder for credit risk score and suspicious application flags."
  },
  {
    title: "Update status",
    description: "Placeholder for requesting documents, approving, or rejecting applications."
  }
];

export default function OfficerDashboardPage() {
  return (
    <AppShell>
      <DashboardPlaceholder
        actions={actions}
        description="A loan officer workspace for reviewing applications, checking documents, and making final decisions."
        role="Officer"
        stats={stats}
        title="Application review queue"
      />
    </AppShell>
  );
}

