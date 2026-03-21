"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
import { useSignOut } from "@/core/packages/auth/client";
import { navItems } from "./nav-items";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const signOut = useSignOut();
  const isMobile = useIsMobile();

  // Close when viewport resizes above mobile breakpoint
  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-14 z-50 border-b bg-background p-4 shadow-lg md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </button>
                );
              })}
              <div className="my-2 border-t" />
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
};
