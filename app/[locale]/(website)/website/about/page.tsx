import { AboutContent } from "@/components/website/about/AboutContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "About Us | iEvents",
  description: "Learn more about iEvents and our mission",
};

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-center max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </CardContent>
      </Card>

      <AboutContent />
    </div>
  );
}
