import { PricingPlan } from "@/components/website/pricing/PricingPlan";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PricingPlan
          title="Free Plan"
          price="$0"
          features={["Feature 1", "Feature 2"]}
          ctaText="Get Started"
        />
        <PricingPlan
          title="Pro Plan"
          price="$99"
          features={["Feature 1", "Feature 2", "Feature 3"]}
          ctaText="Upgrade to Pro"
        />
        <PricingPlan
          title="Enterprise Plan"
          price="Custom"
          features={["Feature 1", "Feature 2", "Feature 3", "Feature 4"]}
          ctaText="Contact Sales"
        />
      </div>
    </div>
  );
}

