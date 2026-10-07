import type { Metadata } from "next";

import { AdminPanel } from "@/components/admin/admin-panel";
import { aiSearchEnabled } from "@/lib/ai-search";
import {
  missingSettings,
  passcodeRequired,
  publishingMode,
} from "@/lib/site-text-store";

export const metadata: Metadata = {
  title: "Admin panel — edit site text",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminPanel
      mode={publishingMode()}
      passcodeRequired={passcodeRequired()}
      missing={missingSettings()}
      aiSearch={aiSearchEnabled()}
    />
  );
}
