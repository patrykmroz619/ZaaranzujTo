"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/core/alert-dialog";
import { Input } from "@repo/ui/core/input";
import { Label } from "@repo/ui/core/label";

type TDeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const DeleteAccountDialog = (props: TDeleteAccountDialogProps) => {
  const { open, onOpenChange, onConfirm } = props;
  const t = useTranslations("settings");
  const [typedValue, setTypedValue] = useState("");

  const expectedPhrase = t("deleteAccountConfirmPhrase");
  const isConfirmed = typedValue.trim() === expectedPhrase;

  useEffect(() => {
    if (!open) setTypedValue("");
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">{t("deleteAccountTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteAccountConsequences")}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label className="text-sm">
            {t("deleteAccountTypePrompt", { phrase: expectedPhrase })}
          </Label>
          <Input
            value={typedValue}
            onChange={(event) => setTypedValue(event.target.value)}
            placeholder={expectedPhrase}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!isConfirmed}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {t("deleteAccount")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
