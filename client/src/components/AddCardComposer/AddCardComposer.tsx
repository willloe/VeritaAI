import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/store';

interface AddCardComposerProps {
  listId: string;
}

export function AddCardComposer({ listId }: AddCardComposerProps) {
  const [title, setTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addCard = useBoardStore((s) => s.addCard);
  const setAddComposer = useBoardStore((s) => s.setAddComposer);

  const close = useCallback(() => {
    setAddComposer(null);
    setTitle('');
  }, [setAddComposer]);

  const submit = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await addCard(listId, trimmed);
    setTitle('');
    textareaRef.current?.focus();
  }, [addCard, listId, title]);

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Escape to close, Enter to submit (shift+enter for newline)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [close, submit]
  );

  // Auto-resize textarea
  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, []);

  return (
    <div className="px-2 pb-2">
      {/* Card-like textarea */}
      <div className="rounded-card bg-surface-raised shadow-card overflow-hidden">
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter a title or paste a link"
          className="w-full resize-none border-0 bg-transparent px-2 py-[6px] text-[14px] leading-5 text-text-default placeholder-text-subtlest focus:outline-none"
          rows={2}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 mt-2">
        <button
          onClick={submit}
          className="rounded-[3px] bg-[#579dff] px-3 py-[6px] text-[14px] font-medium text-[#1d2125] hover:bg-[#85b8ff] transition-colors"
        >
          Add card
        </button>
        <button
          className="flex items-center gap-1 rounded-[3px] bg-[#6e5dc6] px-3 py-[6px] text-[14px] font-medium text-white hover:bg-[#8777d9] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1a5 5 0 110 10A5 5 0 018 3zm-.5 2v2.5H5v1h2.5V11h1V8.5H11v-1H8.5V5h-1z" />
          </svg>
          Tip
        </button>
        <button
          onClick={close}
          className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors ml-auto"
          aria-label="Cancel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
