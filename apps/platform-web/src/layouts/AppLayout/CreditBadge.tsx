"use client";

import Link from "next/link";
import { Coins } from "lucide-react";

import { useCurrentUser } from "@/core/packages/auth/client";
import { useProfile } from "@/core/packages/profile";

export const CreditBadge = () => {
  const { isSignedIn } = useCurrentUser();
  const { profile, isLoading } = useProfile();

  if (!isSignedIn) {
    return null;
  }

  if (isLoading) {
    return <div className="h-7 w-14 animate-pulse rounded-full bg-accent" />;
  }

  return (
    <Link
      href="/credits"
      className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Coins className="h-3.5 w-3.5" />
      {profile?.creditBalance ?? 0}
    </Link>
  );
};
