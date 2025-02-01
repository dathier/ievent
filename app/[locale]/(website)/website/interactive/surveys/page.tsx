import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SurveysOverviewPage() {
  const t = useTranslations("Website.Interactive.Surveys");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-6">{t("description")}</p>
      <Button asChild>
        <Link href="/website/interactive/surveys/create">
          {t("createSurvey")}
        </Link>
      </Button>
    </div>
  );
}
