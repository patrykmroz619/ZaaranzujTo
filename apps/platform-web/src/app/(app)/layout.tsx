type TLayoutProps = {
  children: React.ReactNode;
};

const Layout = async (props: TLayoutProps) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default Layout;
