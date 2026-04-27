"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/core/dialog";
import { InputWithCounter } from "@repo/ui/core/input-with-counter";

type TEditProjectNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onSave: (name: string) => void;
  isPending?: boolean;
};

export const EditProjectNameDialog = (props: TEditProjectNameDialogProps) => {
  const { open, onOpenChange, currentName, onSave, isPending } = props;
  const [name, setName] = useState(currentName);
  const t = useTranslations();

  useEffect(() => {
    if (!open) return;
    setName(currentName);
  }, [open, currentName]);

  const trimmedName = name.trim();
  const isNameChanged = useMemo(
    () => trimmedName !== currentName.trim(),
    [trimmedName, currentName],
  );
  const isSaveDisabled = !trimmedName || !isNameChanged || isPending;

  const handleSave = () => {
    if (isSaveDisabled) return;
    onSave(trimmedName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">{t("dashboard.editName")}</DialogTitle>
        </DialogHeader>
        <InputWithCounter
          placeholder={t("project.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          aria-required
          aria-label={t("project.nameLabel")}
          footerLeft={
            !trimmedName ? (
              <p className="text-sm text-destructive">{t("project.nameRequired")}</p>
            ) : null
          }
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="gradient-warm text-primary-foreground border-0"
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
