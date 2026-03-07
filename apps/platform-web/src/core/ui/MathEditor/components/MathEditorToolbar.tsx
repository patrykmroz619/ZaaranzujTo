'use client';

import { Button } from '@/core/ui/base/button';

type TMathEditorToolbarProps = {
  onInsertInline: () => void;
  onInsertBlock: () => void;
  disabled?: boolean;
};

export const MathEditorToolbar = (props: TMathEditorToolbarProps) => {
  const { onInsertInline, onInsertBlock, disabled = false } = props;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onInsertInline}
      >
        Inline math
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onInsertBlock}
      >
        Block math
      </Button>
    </div>
  );
};
