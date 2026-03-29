"use client";

import { Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TIterationObject } from "@repo/contracts";
import { useAssetUrl } from "@/modules/storage/hooks/use-asset-url";

type TIterationThumbnailProps = {
  iteration: TIterationObject;
  isActive: boolean;
  onSelect: (id: string) => void;
};

const IterationThumbnail = (props: TIterationThumbnailProps) => {
  const { iteration, isActive, onSelect } = props;
  const t = useTranslations("workspace");
  const { url: imageUrl } = useAssetUrl(iteration.result?.imageAssetId);
  const label = `${t("iteration")} ${iteration.iterationNo}`;

  return (
    <button
      onClick={() => onSelect(iteration.id)}
      className={`flex-shrink-0 rounded-lg border-2 p-1 transition-all ${
        isActive ? "border-primary shadow-card" : "border-transparent hover:border-border"
      }`}
    >
      <div className="flex h-16 w-24 items-center justify-center rounded bg-muted overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
        )}
      </div>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">{label}</p>
    </button>
  );
};

type TIterationStripProps = {
  iterations: TIterationObject[];
  activeIterationId: string;
  onSelect: (id: string) => void;
};

export const IterationStrip = (props: TIterationStripProps) => {
  const { iterations, activeIterationId, onSelect } = props;

  if (iterations.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {iterations.map((it) => (
        <IterationThumbnail
          key={it.id}
          iteration={it}
          isActive={activeIterationId === it.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
