"use client";

import { useState, useMemo } from "react";
import type { TGalleryEntry, TRoomType } from "./data";
import { ROOM_TYPE_LABELS } from "./data";
import { IterationSequenceCard } from "./IterationSequenceCard";
import { GalleryItemCard } from "./GalleryItemCard";

const ROOM_TYPES: TRoomType[] = [
  "salon",
  "kuchnia",
  "sypialnia",
  "lazienka",
  "pokoj-dzieciecy",
  "biuro",
  "przedpokoj",
];

type TProps = {
  data: TGalleryEntry[];
};

export const GalleryIsland = ({ data }: TProps) => {
  const [activeRoom, setActiveRoom] = useState<TRoomType>("salon");

  const sequence = useMemo(
    () => data.find((e) => e.kind === "iteration-sequence" && e.roomType === activeRoom),
    [data, activeRoom],
  );

  const items = useMemo(
    () => data.filter((e) => e.kind === "gallery-item" && e.roomType === activeRoom),
    [data, activeRoom],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-9">
        {ROOM_TYPES.map((room) => (
          <button
            key={room}
            onClick={() => setActiveRoom(room)}
            className={`px-3.5 py-2 rounded-full text-[13px] border transition-all duration-150 ${
              activeRoom === room
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border"
            }`}
          >
            {ROOM_TYPE_LABELS[room]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {sequence && sequence.kind === "iteration-sequence" && (
          <IterationSequenceCard item={sequence} />
        )}
        {items.map(
          (item) => item.kind === "gallery-item" && <GalleryItemCard key={item.id} item={item} />,
        )}
      </div>
    </div>
  );
};
