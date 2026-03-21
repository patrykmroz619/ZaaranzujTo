"use client";

import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type TAppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = (props: TAppLayoutProps) => {
  const { children } = props;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
