import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("Frontend.footer");

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold">
              iEvents
            </Link>
            <p className="text-gray-400 text-base">{t("description")}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  {t("solutions")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {["events", "venues", "pricing"].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/frontend/${item}`}
                        className="text-base text-gray-400 hover:text-white"
                      >
                        {t(item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  {t("support")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {["about", "contact", "terms", "privacy"].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/frontend/${item}`}
                        className="text-base text-gray-400 hover:text-white"
                      >
                        {t(item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} iEvents. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
