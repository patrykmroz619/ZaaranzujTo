'use client';

import 'katex/dist/katex.min.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, Tiptap } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mathematics from '@tiptap/extension-mathematics';
import { MathEquationDialog, MathEditorToolbar } from './components';

import './MathEditor.styles.scss';

type TMathEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type TMathDialogMode =
  | 'insert-inline'
  | 'insert-block'
  | 'edit-inline'
  | 'edit-block';

type TMathDialogState = {
  isOpen: boolean;
  mode: TMathDialogMode;
  latex: string;
  pos: number | null;
};

const EMPTY_DOC = '<p></p>';

export const MathEditor = (props: TMathEditorProps) => {
  const { value, onChange } = props;

  const lastEditorHtmlRef = useRef<string>(value || EMPTY_DOC);
  const [dialogState, setDialogState] = useState<TMathDialogState>({
    isOpen: false,
    mode: 'insert-inline',
    latex: '',
    pos: null,
  });

  const openMathDialog = useCallback(
    (params: { mode: TMathDialogMode; latex?: string; pos?: number }) => {
      const { mode, latex, pos } = params;

      setDialogState({
        isOpen: true,
        mode,
        latex: latex ?? '',
        pos: pos ?? null,
      });
    },
    [],
  );

  const closeMathDialog = useCallback(() => {
    setDialogState((previousState) => ({
      ...previousState,
      isOpen: false,
    }));
  }, []);

  const handleDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        closeMathDialog();
      }
    },
    [closeMathDialog],
  );

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      Mathematics.configure({
        inlineOptions: {
          onClick: (node, pos) => {
            openMathDialog({
              mode: 'edit-inline',
              latex: node.attrs.latex,
              pos,
            });
          },
        },
        blockOptions: {
          onClick: (node, pos) => {
            openMathDialog({
              mode: 'edit-block',
              latex: node.attrs.latex,
              pos,
            });
          },
        },
        katexOptions: {
          throwOnError: false,
        },
      }),
    ],
    content: value || EMPTY_DOC,
    onCreate: (params) => {
      lastEditorHtmlRef.current = params.editor.getHTML();
    },
    onUpdate: (params) => {
      const nextHtml = params.editor.getHTML();
      lastEditorHtmlRef.current = nextHtml;
      onChange(nextHtml);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = value || EMPTY_DOC;

    if (nextValue === lastEditorHtmlRef.current) {
      return;
    }

    // if (editor.getHTML() !== nextValue) {
    //   editor.commands.setContent(nextValue, { emitUpdate: false });
    //   lastEditorHtmlRef.current = nextValue;
    // }
  }, [editor, value]);

  const handleInsertInline = useCallback(() => {
    openMathDialog({ mode: 'insert-inline' });
  }, [openMathDialog]);

  const handleInsertBlock = useCallback(() => {
    openMathDialog({ mode: 'insert-block' });
  }, [openMathDialog]);

  const handleSaveMath = (latex: string) => {
    if (!editor) {
      return;
    }

    const { mode, pos } = dialogState;

    if (mode === 'edit-inline' && pos !== null) {
      editor
        .chain()
        .setNodeSelection(pos)
        .updateInlineMath({ latex })
        .focus()
        .run();
      closeMathDialog();
      return;
    }

    if (mode === 'edit-block' && pos !== null) {
      editor
        .chain()
        .setNodeSelection(pos)
        .updateBlockMath({ latex })
        .focus()
        .run();
      closeMathDialog();
      return;
    }

    if (mode === 'insert-inline') {
      editor.chain().focus().insertInlineMath({ latex }).run();
      closeMathDialog();
      return;
    }
    console.log('inserting block math with latex', latex);
    editor.chain().focus().insertBlockMath({ latex }).run();
    closeMathDialog();
  };

  const dialogTitle =
    dialogState.mode === 'edit-inline' || dialogState.mode === 'edit-block'
      ? 'Edit equation'
      : 'Insert equation';

  const dialogDescription =
    dialogState.mode === 'insert-block' || dialogState.mode === 'edit-block'
      ? 'Create or update a block equation.'
      : 'Create or update an inline equation.';

  return (
    <div className="w-full">
      <Tiptap editor={editor}>
        <MathEditorToolbar
          onInsertInline={handleInsertInline}
          onInsertBlock={handleInsertBlock}
          disabled={!editor}
        />
        <Tiptap.Content className="rounded-md border border-input bg-background [&>div]:p-3" />
      </Tiptap>
      <MathEquationDialog
        isOpen={dialogState.isOpen}
        initialLatex={dialogState.latex}
        title={dialogTitle}
        description={dialogDescription}
        onOpenChange={handleDialogOpenChange}
        onSave={handleSaveMath}
      />
    </div>
  );
};
