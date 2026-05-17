"use client";

import { useState, useEffect } from "react";

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 760) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button
        className="hidden max-[760px]:inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-border text-foreground hover:bg-muted transition-colors"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div
        className={`hidden max-[760px]:flex flex-col absolute top-16 left-0 right-0 z-10 bg-background border-b border-border px-4.5 pt-2 pb-4.5 shadow-[0_12px_24px_-12px_hsl(0_0%_0%/0.12)] transition-[opacity,transform] duration-180 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <a
          href="#galeria"
          className="py-3.5 px-1 text-base text-foreground border-b border-border/60"
          onClick={close}
        >
          Galeria
        </a>
        <a
          href="#jak"
          className="py-3.5 px-1 text-base text-foreground border-b border-border/60"
          onClick={close}
        >
          Jak to działa
        </a>
        <a href="#cennik" className="py-3.5 px-1 text-base text-foreground" onClick={close}>
          Cennik
        </a>
        <a
          href="#login"
          className="mt-3.5 flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-[15px] font-medium bg-foreground text-background border border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-[background,color,border-color] duration-150"
          onClick={close}
        >
          Zaloguj się
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </>
  );
};
