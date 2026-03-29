"use client";

import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/core/packages/auth/client";
import { getProfile } from "./profile.service";

export const useProfile = () => {
  const { isSignedIn } = useCurrentUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isSignedIn,
  });

  return { profile: data, isLoading, error };
};
