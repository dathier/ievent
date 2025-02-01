import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function InteractionsPage() {
  const t = useTranslations("Admin.Interactions");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("surveys.title")}</CardTitle>
            <CardDescription>{t("surveys.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/interactions/surveys">
                {t("surveys.manage")}
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("lotteries.title")}</CardTitle>
            <CardDescription>{t("lotteries.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/interactions/lotteries">
                {t("lotteries.manage")}
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("queue.title")}</CardTitle>
            <CardDescription>{t("queue.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/interactions/queue">{t("queue.manage")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
