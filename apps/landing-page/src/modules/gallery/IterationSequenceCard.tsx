import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { TIterationSequence } from "./data";
import { ROOM_TYPE_LABELS } from "./data";

type TProps = {
  item: TIterationSequence;
};

export const IterationSequenceCard = ({ item }: TProps) => (
  <article className="col-span-12 rounded-(--radius) overflow-hidden bg-card border border-border transition-[transform,box-shadow] duration-250 hover:-translate-y-0.75 hover:shadow-elevated">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5">
      {item.frames.map((frame, i) => (
        <div key={i} className="relative">
          {frame.imageSrc ? (
            <img
              src={frame.imageSrc}
              alt={frame.imageAlt}
              className="w-full h-full object-cover aspect-4/3"
            />
          ) : (
            <PlaceholderImage label={frame.imageAlt} aspectRatio="4/3" />
          )}
          <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.08em] px-2 py-1 rounded-full bg-background/90 text-foreground backdrop-blur-[6px]">
            {frame.label}
          </span>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-background/92 backdrop-blur-[6px]">
            <span className="font-medium capitalize">{ROOM_TYPE_LABELS[item.roomType]}</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">
              {frame.imageAlt.split("—")[1]?.trim() ?? ""}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center gap-4 px-4.5 py-3.5 border-t border-border flex-wrap">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 bg-accent text-accent-foreground">
        ↻ Sekwencja iteracji
      </span>
      <span className="text-muted-foreground text-[13.5px]">
        Ten sam pokój, trzy różne kierunki — bez zaczynania od zera.
      </span>
    </div>
  </article>
);
