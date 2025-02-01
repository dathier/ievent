"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const menuBackgroundColor = "bg-gray-800";
const menuTextColor = "text-gray-100";
const menuHoverColor = "hover:bg-gray-700";

export function Navbar() {
  const t = useTranslations("Frontend.nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkBackgroundColor = () => {
      const hero = document.querySelector(".hero-section");
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        setIsDarkBackground(heroRect.bottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", checkBackgroundColor);
    checkBackgroundColor(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", checkBackgroundColor);
    };
  }, []);

  const isHomePage = pathname.length === 11;

  const navbarClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-transparent": !isScrolled && isHomePage,
      "bg-white/90 backdrop-blur-sm shadow-sm": isScrolled && !isDarkBackground,
      "bg-gray-900/70 backdrop-blur-sm shadow-sm":
        (isScrolled && isDarkBackground) || !isHomePage,
    }
  );

  const linkClasses = cn("transition-colors hover:text-primary", {
    "text-gray-100": isDarkBackground || (!isDarkBackground && isHomePage),
    "text-gray-800": !isDarkBackground && !isHomePage,
  });

  const buttonClasses = cn("transition-colors", {
    "text-white hover:text-gray-700": isDarkBackground || isHomePage,
    "text-gray-900 hover:text-gray-300": !isDarkBackground,
  });

  return (
    <header className={cn(navbarClasses, "backdrop-filter")}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className={cn("text-2xl font-bold", linkClasses)}>
              iEvents
            </Link>
          </div>
          <NavigationMenu className="hidden md:flex mx-4">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <Link href="/website" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "nav-link",
                      "text-lg px-4 py-2",
                      menuTextColor
                    )}
                  >
                    {t("home")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`text-lg px-4 py-2 ${menuBackgroundColor} ${menuTextColor}`}
                >
                  {t("events")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className={`p-2 ${menuBackgroundColor}`}>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className={`flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md ${menuTextColor} ${menuHoverColor}`}
                          href="/website/events"
                        >
                          <div className="mb-2 mt-4 text-xl font-medium">
                            {t("allEvents")}
                          </div>
                          <p className="text-base leading-tight text-muted-foreground">
                            {t("allEventsDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${menuTextColor} ${menuHoverColor}`}
                          href="/website/events/upcoming"
                        >
                          <div className="text-lg font-medium leading-none">
                            {t("upcomingEvents")}
                          </div>
                          <p className="line-clamp-2 text-base leading-snug text-muted-foreground mt-1">
                            {t("upcomingEventsDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${menuTextColor} ${menuHoverColor}`}
                          href="/website/events/featured"
                        >
                          <div className="text-lg font-medium leading-none">
                            {t("featuredEvents")}
                          </div>
                          <p className="line-clamp-2 text-base leading-snug text-muted-foreground mt-1">
                            {t("featuredEventsDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/website/venues" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "nav-link",
                      "text-lg px-4 py-2",
                      menuTextColor
                    )}
                  >
                    {t("venues")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`text-lg px-4 py-2 ${menuBackgroundColor} ${menuTextColor}`}
                >
                  {t("interactive")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className={`p-2 ${menuBackgroundColor}`}>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className={`flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md ${menuTextColor} ${menuHoverColor}`}
                          href="/website/interactive"
                        >
                          <div className="mb-2 mt-4 text-xl font-medium">
                            {t("interactiveFeatures")}
                          </div>
                          <p className="text-base leading-tight text-muted-foreground">
                            {t("interactiveFeaturesDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${menuTextColor} ${menuHoverColor}`}
                          href="/website/interactive/surveys"
                        >
                          <div className="text-lg font-medium leading-none">
                            {t("surveys")}
                          </div>
                          <p className="line-clamp-2 text-base leading-snug text-muted-foreground mt-1">
                            {t("surveysDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${menuTextColor} ${menuHoverColor}`}
                          href="/website/interactive/lotteries"
                        >
                          <div className="text-lg font-medium leading-none">
                            {t("lotteries")}
                          </div>
                          <p className="line-clamp-2 text-base leading-snug text-muted-foreground mt-1">
                            {t("lotteriesDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${menuTextColor} ${menuHoverColor}`}
                          href="/website/interactive/queue"
                        >
                          <div className="text-lg font-medium leading-none">
                            {t("queue")}
                          </div>
                          <p className="line-clamp-2 text-base leading-snug text-muted-foreground mt-1">
                            {t("queueDescription")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/website/pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "nav-link",
                      "text-lg px-4 py-2",
                      menuTextColor
                    )}
                  >
                    {t("pricing")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/website/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "nav-link",
                      "text-lg px-4 py-2",
                      menuTextColor
                    )}
                  >
                    {t("about")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/website/interactive/ideas" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "nav-link",
                      "text-lg px-4 py-2",
                      menuTextColor
                    )}
                  >
                    {t("interactiveIdeas")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Button
              variant="outline"
              className="bg-transparent border-gray-300 text-gray-100 hover:bg-gray-100 hover:text-gray-900"
            >
              <Link href="/admin/dashboard" legacyBehavior>
                <a target="_blank">{t("loginAdmin")}</a>
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              className={buttonClasses}
              size="icon"
              onClick={toggleMenu}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className={`md:hidden ${menuBackgroundColor}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/website"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                linkClasses,
                menuTextColor,
                menuHoverColor
              )}
              onClick={toggleMenu}
            >
              {t("home")}
            </Link>
            <Link
              href="/website/events"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                linkClasses,
                menuTextColor,
                menuHoverColor
              )}
              onClick={toggleMenu}
            >
              {t("events")}
            </Link>
            <Link
              href="/website/venues"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                linkClasses,
                menuTextColor,
                menuHoverColor
              )}
              onClick={toggleMenu}
            >
              {t("venues")}
            </Link>
            <div className="relative">
              <button
                onClick={() => {
                  // Toggle submenu
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between",
                  linkClasses,
                  menuTextColor,
                  menuHoverColor
                )}
              >
                {t("interactive")}
              </button>
              <div className="pl-4">
                <Link
                  href="/website/interactive/surveys"
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    linkClasses,
                    menuTextColor,
                    menuHoverColor
                  )}
                  onClick={toggleMenu}
                >
                  {t("surveys")}
                </Link>
                <Link
                  href="/website/interactive/lotteries"
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    linkClasses,
                    menuTextColor,
                    menuHoverColor
                  )}
                  onClick={toggleMenu}
                >
                  {t("lotteries")}
                </Link>
                <Link
                  href="/website/interactive/queue"
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    linkClasses,
                    menuTextColor,
                    menuHoverColor
                  )}
                  onClick={toggleMenu}
                >
                  {t("queue")}
                </Link>
              </div>
            </div>
            <Link
              href="/website/pricing"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                linkClasses,
                menuTextColor,
                menuHoverColor
              )}
              onClick={toggleMenu}
            >
              {t("pricing")}
            </Link>
            <Link
              href="/website/about"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                linkClasses,
                menuTextColor,
                menuHoverColor
              )}
              onClick={toggleMenu}
            >
              {t("about")}
            </Link>
            <Link
              href="/website/interactive/ideas"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                linkClasses,
                menuTextColor,
                menuHoverColor
              )}
              onClick={toggleMenu}
            >
              {t("interactiveIdeas")}
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <LanguageToggle />
              <Button variant="default" className="ml-auto">
                <Link href="/admin/dashboard" legacyBehavior>
                  <a target="_blank">{t("loginAdmin")}</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
