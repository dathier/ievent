"use client";

import { Navbar } from "@/components/website/layout/Navbar";
import { Footer } from "@/components/website/layout/Footer";
import { usePathname } from "next/navigation";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isEventPage = pathname.includes("/events/");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {!isEventPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isEventPage && <Footer />}
    </div>
  );
}
