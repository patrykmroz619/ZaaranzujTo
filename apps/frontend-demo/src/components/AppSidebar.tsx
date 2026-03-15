import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FolderOpen, Coins, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();

  const creditBalance = 4; // mock

  const mainItems = [
    { title: t("nav.dashboard"), url: "/dashboard", icon: Home },
    { title: t("nav.projects"), url: "/projects", icon: FolderOpen },
    { title: t("nav.credits"), url: "/credits", icon: Coins },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">Z</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                ZaaranżujTo
              </span>
              <span className="text-xs text-muted-foreground">
                Studio AI wnętrz
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        {/* User + credits row */}
        <div className="px-2 py-2">
          <div
            className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-3"}`}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                Nu
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-none truncate">
                  Nowy użytkownik
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Konto indywidualne
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => navigate("/credits")}
                className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <Coins className="h-3 w-3" />
                {creditBalance}
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={() => navigate("/credits")}
              className="mt-1 flex items-center justify-center w-full text-xs text-muted-foreground hover:text-foreground"
            >
              <Coins className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={() => navigate("/login")} className="w-full">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>{t("nav.signOut")}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
