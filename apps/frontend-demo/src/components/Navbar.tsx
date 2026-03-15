import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Coins, Settings, LogOut, Home, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isAuthenticated?: boolean;
  creditBalance?: number;
}

export function Navbar({ isAuthenticated = false, creditBalance = 0 }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.dashboard"), path: "/dashboard", icon: Home },
    { label: t("nav.projects"), path: "/projects", icon: FolderOpen },
    { label: t("nav.credits"), path: "/credits", icon: Coins },
    { label: t("nav.settings"), path: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight text-foreground">
              Zaaranżuj<span className="text-primary">To</span>
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(link.path)}
                  className={
                    isActive(link.path)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {link.label}
                </Button>
              ))}
            </nav>
          )}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Credit balance widget */}
            <Link
              to="/credits"
              className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Coins className="h-3.5 w-3.5" />
              {creditBalance}
            </Link>

            {/* User widget */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      Nu
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && (
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        Nowy użytkownik
                      </p>
                      <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isMobile && (
                  <>
                    <div className="px-2 py-2 text-sm">
                      <p className="font-medium text-foreground">Nowy użytkownik</p>
                      <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t("nav.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              {t("nav.signIn")}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/register")}
              className="gradient-warm text-primary-foreground border-0"
            >
              {t("nav.register")}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile nav overlay */}
      {isAuthenticated && mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 right-0 top-14 z-50 border-b bg-background p-4 shadow-lg md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.path)
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              ))}
              <div className="my-2 border-t" />
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                {t("nav.signOut")}
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
