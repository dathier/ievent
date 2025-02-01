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
    let newPathname;
    // 处理根路径的情况
    if (pathname === "/") {
      newPathname = `/${newLocale}`;
    } else {
      // 确保 pathname 包含 locale 前缀
      const pathWithLocale = pathname.startsWith(`/${locale}`)
        ? pathname
        : `/${locale}${pathname}`;
      newPathname = pathWithLocale.replace(`/${locale}`, `/${newLocale}`);
    }
    router.push(newPathname);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="w-8 h-8"
    >
      {locale === "zh" ? "En" : "中"}
    </Button>
  );
}
