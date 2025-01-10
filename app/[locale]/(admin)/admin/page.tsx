import { useTranslations } from "next-intl";

export default function AdminDashboard() {
  const t = useTranslations("Admin.dashboard");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title={t("totalEvents")} value="150" />
        <DashboardCard title={t("totalVenues")} value="50" />
        <DashboardCard title={t("totalUsers")} value="1000" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
