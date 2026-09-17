import type { Metadata } from "next";
import { Card } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { DocumentUpload } from "@/components/dashboard/DocumentUpload";
import { documentsPage } from "@/data/content";

export const metadata: Metadata = { title: "Documentazione" };

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader title={documentsPage.title} />

      <Card title={documentsPage.uploadTitle}>
        <p className="mb-6 text-mist">{documentsPage.uploadDescription}</p>
        <DocumentUpload />
      </Card>

      <Card title={documentsPage.paymentsTitle}>
        <DocumentList />
      </Card>
    </div>
  );
}
