'use client';

import 'mathlive';
import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { Button } from '@/core/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/ui/base/dialog';

type TMathEquationDialogProps = {
  isOpen: boolean;
  initialLatex: string;
  title: string;
  description: string;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (latex: string) => void;
};

type TMathFieldElement = HTMLElement & {
  value: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
      };
    }
  }
}

export const MathEquationDialog = (props: TMathEquationDialogProps) => {
  const { isOpen, initialLatex, title, description, onOpenChange, onSave } =
    props;

  const mathFieldRef = useRef<TMathFieldElement | null>(null);
  const [latex, setLatex] = useState(initialLatex);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLatex(initialLatex);

    if (mathFieldRef.current) {
      mathFieldRef.current.value = initialLatex;
      mathFieldRef.current.focus();
    }
  }, [initialLatex, isOpen]);

  useEffect(() => {
    const mathFieldElement = mathFieldRef.current;

    if (!mathFieldElement) {
      return;
    }

    const handleInput = (event: Event) => {
      const target = event.currentTarget as TMathFieldElement;
      setLatex(target.value);
    };

    mathFieldElement.addEventListener('input', handleInput);

    return () => {
      mathFieldElement.removeEventListener('input', handleInput);
    };
  }, [isOpen]);

  const handleSave = useCallback(() => {
    const currentLatex = mathFieldRef.current?.value ?? latex;
    onSave(currentLatex);
  }, [latex, onSave]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-input p-3">
          <math-field
            ref={mathFieldRef}
            value={latex}
            style={{ width: '100%', minHeight: '96px', fontSize: '1.25rem' }}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save equation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
