import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";

// 创建 Next-intl 中间件
const intlMiddleware = createIntlMiddleware({
  locales: ["en", "zh"],
  defaultLocale: "en",
});

// 定义公共路由
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)", // 包括所有 API 路由
  "/", // 首页
]);

// 组合 Clerk 和 Next-intl 中间件
// const combinedMiddleware = (request) => {
//   const pathname = request.nextUrl.pathname;

//   // 如果是 API 路由，直接返回
//   if (pathname.startsWith("/api/")) {
//     return;
//   }

//   // 对于非 API 路由，应用国际化中间件
//   const intlResponse = intlMiddleware(request);
//   if (intlResponse) return intlResponse;

//   // 最后应用 Clerk 中间件
//   // return clerkMiddleware(async (auth, req) => {
//   //   if (!isPublicRoute(req)) {
//   //     await auth.protect();
//   //   }
//   // })(request);
// };

//export default combinedMiddleware;

// Bug 修复：修改 matcher 以正确匹配路由
export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和所有静态文件
    "/((?!_next|static|favicon.ico).*)",
    "/public/(.*)",
    // API 路由
    "/api/(.*)",
  ],
};
