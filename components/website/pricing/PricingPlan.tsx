"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { RegistrationModal } from "./RegistrationModal";

interface PricingPlanProps {
  planKey: string;
  features: string[];
}

export function PricingPlan({ planKey, features }: PricingPlanProps) {
  const t = useTranslations("Pricing");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t(`${planKey}.title`)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4 text-center">
            {t(`${planKey}.price`)}
          </div>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t(`${planKey}.features.${feature}`)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-lg py-6"
            onClick={() => setIsModalOpen(true)}
          >
            {t(`${planKey}.ctaText`)}
          </Button>
        </CardFooter>
      </Card>
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planKey={planKey}
      />
    </>
  );
}
