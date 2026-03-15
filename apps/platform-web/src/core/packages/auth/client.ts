"use client";

import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import type { TUser } from "./index";

export const useCurrentUser = (): {
  user: TUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
} => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!user) {
    return { user: null, isLoaded, isSignedIn: isSignedIn ?? false };
  }

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.primaryEmailAddress?.emailAddress || "",
    },
    isLoaded,
    isSignedIn: isSignedIn ?? false,
  };
};

export const useSession = () => {
  const { userId, sessionId, isLoaded, isSignedIn } = useAuth();

  return {
    userId,
    sessionId,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
  };
};

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return handleSignOut;
};
