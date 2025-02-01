import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { AppConfig } from "@/lib/AppConfig";

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  defaultLocale: AppConfig.defaultLocale,
  alternateLinks: false,
  localePrefix: "as-needed",
});

const isProtectedRoute = createRouteMatcher([
  "/:locale/(.*)",
  "/",
  "/api/:path*",
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  if (pathname.includes("/:locale/")) {
    const locale = pathname.split("/")[1] as (typeof AppConfig.locales)[number];
    const replacedPathname = pathname.replace("/:locale/", "");

    // Ensure the locale is valid, otherwise use the default locale
    const validLocale = AppConfig.locales.includes(locale)
      ? locale
      : AppConfig.defaultLocale;

    return NextResponse.redirect(
      new URL(`/${validLocale}/${replacedPathname}`, req.url)
    );
  }

  // 如果是 API 路由，直接返回
  if (pathname.startsWith("/api/")) {
    return;
  }

  if (isProtectedRoute(req)) {
    auth.protect();
  }

  return intlMiddleware(req);
});

// Update the config to exclude static files and include API routes
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    // Include API routes
    "/(api|trpc)(.*)",
  ],
};
