import { PricingPlan } from "@/components/website/pricing/PricingPlan";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: 'Pricing | iEvents',
  description: 'Explore our pricing plans and choose the best option for your needs',
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Our Pricing Plans</CardTitle>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PricingPlan
          title="Free Plan"
          price="$0"
          features={["Basic event creation", "Up to 50 attendees", "Email support"]}
          ctaText="Get Started"
        />
        <PricingPlan
          title="Pro Plan"
          price="$99"
          features={["Advanced event management", "Up to 500 attendees", "Priority support", "Custom branding"]}
          ctaText="Upgrade to Pro"
        />
        <PricingPlan
          title="Enterprise Plan"
          price="Custom"
          features={["Unlimited events", "Unlimited attendees", "24/7 dedicated support", "API access", "Custom integrations"]}
          ctaText="Contact Sales"
        />
      </div>
    </div>
  );
}

