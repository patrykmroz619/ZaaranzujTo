"use client";

import * as React from "react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "../core/dialog";
import { cn } from "../lib/utils";

type TExpandableImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const ExpandableImage = (props: TExpandableImageProps) => {
  const { src, alt, className } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("group relative overflow-hidden rounded-md cursor-zoom-in", className)}
      >
        <div className="aspect-video w-full">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-1.5 top-1.5 rounded bg-black/40 p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3 w-3 text-white" />
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-2">
          <img src={src} alt={alt} className="w-full rounded-md object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ExpandableImage, type TExpandableImageProps };
