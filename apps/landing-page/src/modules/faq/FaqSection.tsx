"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { TFaqItem } from "./data";

type TProps = {
  data: TFaqItem[];
};

export const FaqSection = ({ data }: TProps) => (
  <section className="py-24 max-[720px]:py-16 bg-card">
    <div className="container">
      <div className="max-w-180 mx-auto mb-12 text-center">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
          Pytania
        </span>
        <h2 className="mt-3.5 text-foreground text-[clamp(34px,5vw,52px)]">
          Zanim klikniesz „Zacznij"
        </h2>
      </div>

      <Accordion.Root type="single" collapsible className="max-w-190 mx-auto">
        {data.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="border-b border-border">
            <Accordion.Trigger className="group w-full flex items-center justify-between gap-6 py-5.5 px-1 text-left bg-transparent text-foreground cursor-pointer">
              <span className="font-display text-[22px] tracking-[-0.01em]">{item.question}</span>
              <span className="w-7 h-7 rounded-full border border-border grid place-items-center text-muted-foreground text-base shrink-0 transition-[transform,background,color,border-color] duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:border-primary">
                +
              </span>
            </Accordion.Trigger>
            <Accordion.Content
              className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
              style={{
                ["--radix-accordion-content-height" as string]:
                  "var(--radix-accordion-content-height)",
              }}
            >
              <div className="px-1 pb-6 text-muted-foreground text-[15.5px]">{item.answer}</div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>

    <style>{`
      @keyframes accordion-down {
        from { height: 0; }
        to { height: var(--radix-accordion-content-height); }
      }
      @keyframes accordion-up {
        from { height: var(--radix-accordion-content-height); }
        to { height: 0; }
      }
      .data-\\[state\\=open\\]\\:animate-accordion-down[data-state=open] {
        animation: accordion-down 0.3s ease;
      }
      .data-\\[state\\=closed\\]\\:animate-accordion-up[data-state=closed] {
        animation: accordion-up 0.3s ease;
      }
    `}</style>
  </section>
);
