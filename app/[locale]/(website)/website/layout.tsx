import { Navbar } from "@/components/website/layout/Navbar";
import { Footer } from "@/components/website/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
