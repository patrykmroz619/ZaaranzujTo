import { AppLayout } from "@/layouts/AppLayout";

type TLayoutProps = {
  children: React.ReactNode;
};

const Layout = async (props: TLayoutProps) => {
  const { children } = props;

  return <AppLayout>{children}</AppLayout>;
};

export default Layout;
