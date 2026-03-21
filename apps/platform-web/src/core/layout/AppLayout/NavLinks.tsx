"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/core/button";
import { navItems } from "./nav-items";

export const NavLinks = () => {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
          >
            <Link href={item.href}>{t(item.labelKey)}</Link>
          </Button>
        );
      })}
    </nav>
  );
};
