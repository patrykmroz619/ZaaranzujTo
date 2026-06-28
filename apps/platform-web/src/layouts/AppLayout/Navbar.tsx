"use client";

import Link from "next/link";
import { BrandLogo } from "@repo/ui/components/BrandLogo";
import { NavLinks } from "./NavLinks";
import { CreditBadge } from "./CreditBadge";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 outline-none rounded-md focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandLogo />
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
