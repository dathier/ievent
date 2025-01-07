"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    router.push(pathname.replace(`/${locale}`, `/${newLocale}`));
  };

  return (
    <Button onClick={toggleLanguage} variant="outline" size="sm">
      {locale === "zh" ? "English" : "中文"}
    </Button>
  );
}
