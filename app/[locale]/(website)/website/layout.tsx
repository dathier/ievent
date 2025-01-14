"use client";

import { Navbar } from "@/components/website/layout/Navbar";
import { Footer } from "@/components/website/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { use } from "react";
import { usePathname } from "next/navigation";
import { log } from "node:console";

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
