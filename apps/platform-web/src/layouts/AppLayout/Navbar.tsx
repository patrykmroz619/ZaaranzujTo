"use client";

import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { CreditBadge } from "./CreditBadge";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight text-foreground">
              Zaaranżuj<span className="text-primary">To</span>
            </span>
          </Link>

          <NavLinks />
        </div>

        <div className="flex items-center gap-3">
          <CreditBadge />
          <UserMenu />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
