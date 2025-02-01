"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function LotteryRegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Lottery");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Registering for lottery:", name, email);

    try {
      await axios.post(`/api/lotteries/${params.id}/participants`, {
        name,
        email,
      });
      toast({
        title: t("registrationSuccess"),
        description: t("registrationSuccessDescription"),
      });
      router.push(`/website/lottery/${params.id}/result`);
    } catch (error) {
      console.error("Error registering for lottery:", error);
      toast({
        title: t("registrationError"),
        description: t("registrationErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
      <Card className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("registerForLottery")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("name")}
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("registering") : t("register")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
