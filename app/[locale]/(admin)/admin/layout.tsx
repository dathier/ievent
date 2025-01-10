import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 ">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto bg-white">{children}</main>
    </div>
  );
}
