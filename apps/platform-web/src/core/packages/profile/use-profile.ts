"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfile } from "./profile.service";

export const useProfile = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return { profile: data, isLoading, error };
};
