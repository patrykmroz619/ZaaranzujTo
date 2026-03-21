"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/core/dropdown-menu";
import { Avatar, AvatarFallback } from "@repo/ui/core/avatar";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
import { useCurrentUser, useSignOut } from "@/core/packages/auth/client";

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
};

export const UserMenu = () => {
  const router = useRouter();
  const t = useTranslations("nav");
  const { user, isLoaded } = useCurrentUser();
  const signOut = useSignOut();
  const isMobile = useIsMobile();

  const initials = user ? getInitials(user.firstName, user.lastName) : "?";
  const displayName = user?.fullName ?? user?.email ?? "";
  const displayEmail = user?.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/50 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {isLoaded ? initials : "…"}
            </AvatarFallback>
          </Avatar>
          {!isMobile && isLoaded && user && (
            <div className="text-left">
              <p className="text-sm font-medium text-foreground leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isMobile && isLoaded && user && (
          <>
            <div className="px-2 py-2 text-sm">
              <p className="font-medium text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          {t("settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
