import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecommendedInteractive() {
  const t = useTranslations("Website.Home");

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">
        {t("recommendedInteractive")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("surveys")}</CardTitle>
            <CardDescription>{t("surveysDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("surveysContent")}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/website/interactive/surveys">{t("learnMore")}</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("lotteries")}</CardTitle>
            <CardDescription>{t("lotteriesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("lotteriesContent")}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/website/interactive/lotteries">
                {t("learnMore")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("queue")}</CardTitle>
            <CardDescription>{t("queueDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("queueContent")}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/website/interactive/queue">{t("learnMore")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
