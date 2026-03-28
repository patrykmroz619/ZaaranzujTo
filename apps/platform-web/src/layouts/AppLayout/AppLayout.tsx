"use client";

import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SidebarInset, SidebarProvider } from "@repo/ui/core/sidebar";

type TAppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = (props: TAppLayoutProps) => {
  const { children } = props;

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 container py-5">{children}</main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
