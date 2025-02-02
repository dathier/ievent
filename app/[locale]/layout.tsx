import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/provider/Toaster";

export const metadata = {
  title: "iEvents",
  description: "Event Management Platform",
};

// export function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "zh" }];
// }

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.log(error);

    notFound();
  }

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
