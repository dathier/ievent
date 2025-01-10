"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { fetchAPI } from "@/lib/api";

interface WebsiteContent {
  id?: number;
  heroTitle: string;
  heroSubtitle: string;
}

export default function WebsiteManagement() {
  const t = useTranslations("Admin.Website");
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>({
    heroTitle: "",
    heroSubtitle: "",
  });

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  async function fetchWebsiteContent() {
    try {
      const data = await fetchAPI("/admin/website");
      setWebsiteContent(data);
    } catch (error) {
      console.error("Error fetching website content:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetchAPI("/admin/website", {
        method: "POST",
        body: JSON.stringify({
          hero: {
            title: websiteContent.heroTitle,
            description: websiteContent.heroSubtitle,
          },
        }),
      });
      toast({
        title: t("updateSuccess"),
        description: t("updateSuccessDescription"),
      });
    } catch (error) {
      console.error("Error updating website content:", error);
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("heroSection")}</h2>
          <Input
            type="text"
            value={websiteContent.heroTitle}
            onChange={(e) =>
              setWebsiteContent({
                ...websiteContent,
                heroTitle: e.target.value,
              })
            }
            placeholder={t("heroTitle")}
            className="mb-2"
          />
          <Textarea
            value={websiteContent.heroSubtitle}
            onChange={(e) =>
              setWebsiteContent({
                ...websiteContent,
                heroSubtitle: e.target.value,
              })
            }
            placeholder={t("heroDescription")}
          />
        </div>
        <Button type="submit">{t("saveChanges")}</Button>
      </form>
    </div>
  );
}
