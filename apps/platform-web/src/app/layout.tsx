import { ReactNode } from "react";

import { RootLayout } from "@/core/layout/RootLayout";

type TLayoutProps = {
  children: ReactNode;
};

const Layout = (props: TLayoutProps) => {
  const { children } = props;

  return <RootLayout>{children}</RootLayout>;
};

export default Layout;
