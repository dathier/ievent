"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  LayoutDashboard,
  Globe,
  CalendarDays,
  Building2,
  MessageSquare,
  BarChart3,
  Users,
  Menu,
  User,
} from "lucide-react";
import { LanguageToggle } from "../LanguageToggle";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const t = useTranslations("Admin.Sidebar");
  const pathname = usePathname();

  const routes = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: t("websiteManagement"),
      icon: Globe,
      href: "/admin/website",
      active: pathname === "/admin/website",
    },
    {
      label: t("eventManagement"),
      icon: CalendarDays,
      href: "/admin/events",
      active: pathname === "/admin/events",
    },
    {
      label: t("venueManagement"),
      icon: Building2,
      href: "/admin/venues",
      active: pathname === "/admin/venues",
    },
    {
      label: t("interactionManagement"),
      icon: MessageSquare,
      href: "/admin/interactions",
      active: pathname === "/admin/interactions",
    },
    {
      label: t("dataStatistics"),
      icon: BarChart3,
      href: "/admin/stats",
      active: pathname === "/admin/stats",
    },
    {
      label: t("permissionManagement"),
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
  ];

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <aside className="hidden md:flex w-64 flex-col">
        <SidebarContent className="border-r" />
      </aside>
    </>
  );

  function SidebarContent({ className }: { className?: string }) {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <div className="p-6 flex justify-between">
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <LanguageToggle />
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-3 py-2">
            <div className="rounded-full bg-accent p-1">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
