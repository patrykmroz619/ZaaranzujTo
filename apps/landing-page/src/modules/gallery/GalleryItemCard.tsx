"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { TGalleryItem } from "./data";
import { ROOM_TYPE_LABELS } from "./data";

type TProps = {
  item: TGalleryItem;
};

export const GalleryItemCard = ({ item }: TProps) => {
  const [showBefore, setShowBefore] = useState(false);

  const toggle = () => setShowBefore((v) => !v);

  return (
    <article className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-(--radius) overflow-hidden bg-card border border-border transition-[transform,box-shadow] duration-250 hover:-translate-y-0.75 hover:shadow-elevated group">
      <div className="relative aspect-4/3">
        {showBefore ? (
          item.beforeSrc ? (
            <img
              src={item.beforeSrc}
              alt={`${item.alt} — przed`}
              className="w-full h-full object-cover"
            />
          ) : (
            <PlaceholderImage label={`${item.alt} — przed`} aspectRatio="4/3" />
          )
        ) : item.afterSrc ? (
          <img src={item.afterSrc} alt={item.alt} className="w-full h-full object-cover" />
        ) : (
          <PlaceholderImage label={item.alt} aspectRatio="4/3" />
        )}

        <button
          onClick={toggle}
          aria-label={showBefore ? "Pokaż po" : "Pokaż przed"}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center border border-border text-foreground transition-[opacity,background,color,border-color] duration-200 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary max-[720px]:opacity-100 max-[720px]:w-8 max-[720px]:h-8 bg-background/92 backdrop-blur-[6px] shadow-float"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={toggle}
          aria-label={showBefore ? "Pokaż po" : "Pokaż przed"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center border border-border text-foreground transition-[opacity,background,color,border-color] duration-200 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary max-[720px]:opacity-100 max-[720px]:w-8 max-[720px]:h-8 bg-background/92 backdrop-blur-[6px] shadow-float"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 px-2.25 py-1.25 rounded-full bg-background/85 backdrop-blur-[6px]">
          <span
            className={`w-1.25 h-1.25 rounded-full transition-[background] duration-200 ${showBefore ? "bg-primary" : "bg-muted-foreground/40"}`}
          />
          <span
            className={`w-1.25 h-1.25 rounded-full transition-[background] duration-200 ${!showBefore ? "bg-primary" : "bg-muted-foreground/40"}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3.5 text-[13px]">
        <div className="flex items-center gap-2.5">
          <span className="font-medium capitalize">{ROOM_TYPE_LABELS[item.roomType]}</span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground">{item.style}</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground">
          {showBefore ? "PRZED" : "PO"}
        </span>
      </div>
    </article>
  );
};
