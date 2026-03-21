"use client";

import Link from "next/link";
import { Coins } from "lucide-react";

type TCreditBadgeProps = {
  balance: number;
  isLoading?: boolean;
};

export const CreditBadge = (props: TCreditBadgeProps) => {
  const { balance, isLoading } = props;

  if (isLoading) {
    return (
      <div className="h-7 w-14 animate-pulse rounded-full bg-accent" />
    );
  }

  return (
    <Link
      href="/credits"
      className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Coins className="h-3.5 w-3.5" />
      {balance}
    </Link>
  );
};
