import { Navbar } from "@/components/website/layout/Navbar";
import { Footer } from "@/components/website/layout/Footer";

export default function FrontendLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
