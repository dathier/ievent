"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { log } from "util";

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

  const menuItems = [
    { href: "/website", label: t("home") },
    { href: "/website/events", label: t("events") },
    { href: "/website/venues", label: t("venues") },
    { href: "/website/pricing", label: t("pricing") },
    { href: "/website/about", label: t("about") },
  ];

  const isHomePage = pathname.length === 11;
  //console.log("isHomePage", isHomePage);

  const navbarClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-transparent": !isScrolled && isHomePage,
      "bg-white shadow-md": isScrolled && !isDarkBackground,
      "bg-gray-900/80 shadow-md":
        (isScrolled && isDarkBackground) || !isHomePage,
    }
  );

  const linkClasses = cn("transition-colors hover:text-gray-300", {
    "text-white": isDarkBackground,
    "text-gray-100": !isDarkBackground && isHomePage,
  });

  const buttonClasses = cn("transition-colors", {
    "text-white hover:text-gray-700": isDarkBackground || isHomePage,
    "text-gray-900 hover:text-gray-300": !isDarkBackground,
  });

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className={cn("text-2xl font-bold", linkClasses)}>
              iEvents
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  linkClasses,
                  pathname === item.href ? "font-semibold" : "font-medium"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Button variant="ghost" className={buttonClasses} asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button
              className={cn("bg-indigo-600 hover:bg-indigo-700", buttonClasses)}
              asChild
            >
              <Link href="/signup">{t("signup")}</Link>
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  linkClasses,
                  pathname === item.href ? "bg-gray-900 text-white" : ""
                )}
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <LanguageToggle />
              <Button
                variant="ghost"
                className={cn("ml-auto", buttonClasses)}
                asChild
              >
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button
                className={cn(
                  "ml-4 bg-indigo-600 hover:bg-indigo-700",
                  buttonClasses
                )}
                asChild
              >
                <Link href="/signup">{t("signup")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
