import { ReactNode } from "react";

import { RootLayout } from "@/layouts/RootLayout";

type TLayoutProps = {
  children: ReactNode;
};

const Layout = (props: TLayoutProps) => {
  const { children } = props;

  return <RootLayout>{children}</RootLayout>;
};

export default Layout;
