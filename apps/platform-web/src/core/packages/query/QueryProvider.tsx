"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TQueryProviderProps = {
  children: ReactNode;
};

export const QueryProvider = (props: TQueryProviderProps) => {
  const { children } = props;

  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
