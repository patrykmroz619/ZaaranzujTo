"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";

import { Skeleton } from "@repo/ui/core/skeleton";
import { useCurrentUser } from "@/core/packages/auth/client";
import { UserButton } from "@clerk/nextjs";

export const UserMenu = () => {
  const router = useRouter();
  const t = useTranslations("nav");
  const { isLoaded } = useCurrentUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="hidden md:block h-7 w-36 rounded-md" />
      </div>
    );
  }

  return (
    <UserButton showName>
      <UserButton.MenuItems>
        <UserButton.Action
          labelIcon={<Settings className="mr-2 h-4 w-4" />}
          label={t("settings")}
          onClick={() => router.push("/settings")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};
