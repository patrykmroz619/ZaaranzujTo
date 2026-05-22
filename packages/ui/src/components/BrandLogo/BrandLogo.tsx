import { cn } from "../../lib/utils";
import { BrandMark } from "../BrandMark";

type TBrandLogoProps = {
  className?: string;
};

export const BrandLogo = ({ className }: TBrandLogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center font-display text-xl tracking-tight leading-none text-foreground",
        className,
      )}
    >
      <BrandMark className="mr-2" />
      Zaaranżuj<em className="italic text-primary font-normal">To</em>
    </div>
  );
};
