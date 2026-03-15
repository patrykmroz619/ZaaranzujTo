import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  creditBalance?: number;
}

export function AppLayout({ children, isAuthenticated = false, creditBalance = 0 }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAuthenticated={isAuthenticated} creditBalance={creditBalance} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
