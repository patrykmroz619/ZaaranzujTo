import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAuthenticated={true} creditBalance={4} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
