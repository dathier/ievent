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

export default function InteractivePage() {
  const t = useTranslations("Website.Interactive");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t("title")}</h1>
      <p className="text-xl text-center mb-12">{t("description")}</p>

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
              <Link href="/interactive/surveys">{t("learnMore")}</Link>
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
              <Link href="/interactive/lotteries">{t("learnMore")}</Link>
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
              <Link href="/interactive/queue">{t("learnMore")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
