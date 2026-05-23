import { cn } from "../../lib/utils";

type TBrandMarkProps = {
  className?: string;
};

export const BrandMark = ({ className }: TBrandMarkProps) => {
  return (
    <span
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md",
        "bg-primary text-primary-foreground",
        "translate-y-0 hover:translate-y-0.5",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5 4.25H18.75V8.05L21.4 10.3A0.7 0.7 0 0 1 20.95 11.55H20V19.5A0.5 0.5 0 0 1 19.5 20H4.5A0.5 0.5 0 0 1 4 19.5V11.55H3.05A0.7 0.7 0 0 1 2.6 10.3L11.55 2.7A0.7 0.7 0 0 1 12.45 2.7L16.5 6.14Z"
        />
      </svg>
    </span>
  );
};
