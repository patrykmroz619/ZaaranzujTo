"use client";

import { Image as ImageIcon } from "lucide-react";
import type { TIteration } from "@/modules/projects/types/projects.types";

type TIterationStripProps = {
  iterations: TIteration[];
  activeIterationId: string;
  onSelect: (id: string) => void;
};

export const IterationStrip = (props: TIterationStripProps) => {
  const { iterations, activeIterationId, onSelect } = props;

  if (iterations.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {iterations.map((it) => (
        <button
          key={it.id}
          onClick={() => onSelect(it.id)}
          className={`flex-shrink-0 rounded-lg border-2 p-1 transition-all ${
            activeIterationId === it.id
              ? "border-primary shadow-card"
              : "border-transparent hover:border-border"
          }`}
        >
          <div className="flex h-16 w-24 items-center justify-center rounded bg-muted">
            <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <p className="mt-1 text-center text-[10px] text-muted-foreground">{it.label}</p>
        </button>
      ))}
    </div>
  );
};
