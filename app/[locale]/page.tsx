import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function Portal() {
  const t = useTranslations("Portal");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className=" fixed top-1 right-1  py-4 px-4 sm:px-6 lg:px-8 ">
        <LanguageToggle />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
        <div className="space-x-4">
          <Link
            href="/admin"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("adminButton")}
          </Link>
          <Link
            href="/website"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("frontendButton")}
          </Link>
          <Link
            href="/saas"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("userButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
