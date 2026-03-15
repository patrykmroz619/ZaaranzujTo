"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type TThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export const ThemeProvider = (props: TThemeProviderProps) => {
  const { children, ...rest } = props;

  return <NextThemesProvider {...rest}>{children}</NextThemesProvider>;
};
