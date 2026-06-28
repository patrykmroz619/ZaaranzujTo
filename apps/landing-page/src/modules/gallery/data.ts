export type TRoomType =
  | "salon"
  | "kuchnia"
  | "sypialnia"
  | "lazienka"
  | "pokoj-dzieciecy"
  | "biuro"
  | "przedpokoj";

export type TIterationFrame = {
  label: string;
  imageSrc: string;
  imageAlt: string;
};

export type TIterationSequence = {
  kind: "iteration-sequence";
  id: string;
  roomType: TRoomType;
  frames: [TIterationFrame, TIterationFrame, TIterationFrame];
};

export type TGalleryItem = {
  kind: "gallery-item";
  id: string;
  roomType: TRoomType;
  style: string;
  beforeSrc: string;
  afterSrc: string;
  alt: string;
};

export type TGalleryEntry = TIterationSequence | TGalleryItem;

export const ROOM_TYPE_LABELS: Record<TRoomType, string> = {
  salon: "Salon",
  kuchnia: "Kuchnia",
  sypialnia: "Sypialnia",
  lazienka: "Łazienka",
  "pokoj-dzieciecy": "Pokój dziecięcy",
  biuro: "Biuro",
  przedpokoj: "Przedpokój",
};

const STYLES = [
  "skandynawski",
  "nowoczesny",
  "industrialny",
  "boho",
  "klasyczny",
  "minimalistyczny",
] as const;

function makeIterationSeq(
  roomType: TRoomType,
  styles: [string, string, string],
): TIterationSequence {
  const label = ROOM_TYPE_LABELS[roomType];
  return {
    kind: "iteration-sequence",
    id: `iter-${roomType}`,
    roomType,
    frames: [
      { label: "Iteracja 1", imageSrc: "", imageAlt: `${label} — ${styles[0]}` },
      { label: "Iteracja 2", imageSrc: "", imageAlt: `${label} — ${styles[1]}` },
      { label: "Iteracja 3", imageSrc: "", imageAlt: `${label} — ${styles[2]}` },
    ],
  };
}

function makeItems(roomType: TRoomType): TGalleryItem[] {
  const label = ROOM_TYPE_LABELS[roomType];
  return STYLES.map((style, i) => ({
    kind: "gallery-item",
    id: `item-${roomType}-${i}`,
    roomType,
    style,
    beforeSrc: "",
    afterSrc: "",
    alt: `${label} — ${style}`,
  }));
}

export const GALLERY_DATA: TGalleryEntry[] = [
  makeIterationSeq("salon", ["skandynawski", "boho", "industrialny"]),
  ...makeItems("salon"),
  makeIterationSeq("kuchnia", ["nowoczesny", "klasyczny", "minimalistyczny"]),
  ...makeItems("kuchnia"),
  makeIterationSeq("sypialnia", ["skandynawski", "minimalistyczny", "boho"]),
  ...makeItems("sypialnia"),
  makeIterationSeq("lazienka", ["nowoczesny", "industrialny", "klasyczny"]),
  ...makeItems("lazienka"),
  makeIterationSeq("pokoj-dzieciecy", ["boho", "skandynawski", "nowoczesny"]),
  ...makeItems("pokoj-dzieciecy"),
  makeIterationSeq("biuro", ["minimalistyczny", "industrialny", "nowoczesny"]),
  ...makeItems("biuro"),
  makeIterationSeq("przedpokoj", ["klasyczny", "minimalistyczny", "skandynawski"]),
  ...makeItems("przedpokoj"),
];
