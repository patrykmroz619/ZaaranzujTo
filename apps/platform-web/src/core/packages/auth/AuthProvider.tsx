"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { plPL } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      localization={plPL}
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
};
