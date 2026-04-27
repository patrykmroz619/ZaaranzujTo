"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { InputWithCounter } from "@repo/ui/core/input-with-counter";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/core/dialog";

type TCreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
  isPending?: boolean;
};

export const CreateProjectDialog = (props: TCreateProjectDialogProps) => {
  const { open, onOpenChange, onCreate, isPending } = props;
  const [name, setName] = useState("");
  const t = useTranslations();

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gradient-warm text-primary-foreground border-0 gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t("dashboard.newProject")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">{t("dashboard.newProject")}</DialogTitle>
        </DialogHeader>
        <InputWithCounter
          placeholder={t("project.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          aria-required
          aria-label={t("project.nameLabel")}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("dashboard.cancel")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isPending}
            className="gradient-warm text-primary-foreground border-0"
          >
            {t("project.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
