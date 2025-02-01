import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QueueManagementPage() {
  const t = useTranslations("Admin.Interactions.Queue");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <div className="space-y-4">
        <Button asChild>
          <Link href="/admin/interactions/queue/create">{t("create")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/interactions/queue/list">{t("list")}</Link>
        </Button>
      </div>
    </div>
  );
}
