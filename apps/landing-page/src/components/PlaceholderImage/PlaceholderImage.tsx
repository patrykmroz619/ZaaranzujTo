type TProps = {
  label: string;
  aspectRatio?: string;
};

export const PlaceholderImage = ({ label, aspectRatio = "4/3" }: TProps) => (
  <div
    style={{ aspectRatio }}
    className="relative w-full bg-linear-to-br from-secondary to-accent flex items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0 pointer-events-none placeholder-stripes" />
    <span className="font-mono text-[11px] text-muted-foreground tracking-wide text-center px-4 relative z-10 leading-relaxed">
      {label}
    </span>
  </div>
);
