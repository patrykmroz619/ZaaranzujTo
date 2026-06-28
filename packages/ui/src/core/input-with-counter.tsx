"use client";

import * as React from "react";

import { cn } from "../lib/utils";
import { Input } from "./input";

const WARNING_RATIO = 0.8;

type TCharCounterProps = {
  current: number;
  max: number;
  className?: string;
};

const CharCounter = ({ current, max, className }: TCharCounterProps) => {
  const isWarning = current > max * WARNING_RATIO;
  return (
    <p className={cn("text-xs", isWarning ? "text-warning" : "text-muted-foreground", className)}>
      {current}/{max}
    </p>
  );
};

type TInputWithCounterProps = Omit<React.ComponentProps<"input">, "value" | "maxLength"> & {
  value: string;
  maxLength: number;
  footerLeft?: React.ReactNode;
};

const InputWithCounter = React.forwardRef<HTMLInputElement, TInputWithCounterProps>(
  ({ value, maxLength, footerLeft, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <Input ref={ref} value={value} maxLength={maxLength} className={className} {...props} />
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">{footerLeft}</div>
          <CharCounter current={value.length} max={maxLength} />
        </div>
      </div>
    );
  },
);
InputWithCounter.displayName = "InputWithCounter";

export { InputWithCounter, CharCounter };
