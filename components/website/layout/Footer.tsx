import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("Frontend.footer");

  const solutions = ["events", "venues", "pricing"];
  const support = ["about", "contact", "terms", "privacy"];

  return (
    <footer className="border-t bg-gray-800 text-white">
      <div className="container px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold">
              iEvents
            </Link>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {t("solutions")}
              </h3>
              <ul className="mt-4 space-y-2">
                {solutions.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/website/${item}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {t(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {t("support")}
              </h3>
              <ul className="mt-4 space-y-2">
                {support.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/website/${item}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {t(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} iEvents. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
