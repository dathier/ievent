import Link from "next/link";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const t = useTranslations("Admin.nav");

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
      </div>
      <nav className="mt-4">
        <Link
          href="/admin"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("dashboard")}
        </Link>
        <Link
          href="/admin/website"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("websiteManagement")}
        </Link>
        <Link
          href="/admin/events"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("eventManagement")}
        </Link>
        <Link
          href="/admin/venues"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("venueManagement")}
        </Link>
        <Link
          href="/admin/interactions"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("interactionManagement")}
        </Link>
        <Link
          href="/admin/stats"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("statistics")}
        </Link>
        <Link
          href="/admin/users"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          {t("userManagement")}
        </Link>
      </nav>
    </div>
  );
}
