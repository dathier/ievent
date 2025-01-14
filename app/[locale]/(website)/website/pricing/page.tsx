import { PricingPlan } from "@/components/website/pricing/PricingPlan";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Pricing | iEvents",
  description:
    "Explore our pricing plans and choose the best option for your needs",
};

export default function PricingPage() {
  const t = useTranslations("Pricing");

  const plans = [
    { key: "free", features: ["basic", "attendees", "support"] },
    { key: "pro", features: ["advanced", "attendees", "support", "branding"] },
    {
      key: "enterprise",
      features: ["unlimited", "attendees", "support", "api", "integrations"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
      <Card className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.key}
            planKey={plan.key}
            features={plan.features}
          />
        ))}
      </div>
    </div>
  );
}
