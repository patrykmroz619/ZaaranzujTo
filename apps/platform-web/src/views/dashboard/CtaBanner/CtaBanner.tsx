"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import bannerImage from "./banner-image.avif";

export const CtaBanner = () => {
  const router = useRouter();
  const t = useTranslations("dashboard");

  return (
    <Card className="overflow-hidden border-0 relative min-h-[160px]">
      <Image
        src={bannerImage}
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-primary/10" />
      <CardContent className="relative z-10 flex flex-col justify-center h-full min-h-[160px] p-5 md:p-6 max-w-md">
        <h2 className="font-display text-lg md:text-xl leading-snug text-primary-foreground mb-3">
          {t("ctaHeading")}
        </h2>
        <div>
          <Button
            size="sm"
            onClick={() => router.push("/projects")}
            className="bg-background text-foreground hover:bg-background/90 border-0 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("newProject")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
