import { Home, FolderOpen, Coins, Settings, type LucideIcon } from "lucide-react";

type TNavItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: TNavItem[] = [
  { labelKey: "dashboard", href: "/", icon: Home },
  { labelKey: "projects", href: "/projects", icon: FolderOpen },
  { labelKey: "credits", href: "/credits", icon: Coins },
  { labelKey: "settings", href: "/settings", icon: Settings },
];
