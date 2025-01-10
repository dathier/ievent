import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import hero from "@/public/hero.png";

export function Hero() {
  const t = useTranslations("Frontend.hero");

  return (
    <section className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={hero}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
      </div>
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("title")}
            <span className="block text-indigo-400">{t("subtitle")}</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300">{t("description")}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Link href="/website/events">{t("cta")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900"
            >
              <Link href="/website/about">{t("learnMore")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
