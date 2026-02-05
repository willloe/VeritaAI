import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/store';

export function AddListComposer() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addList = useBoardStore((s) => s.addList);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setTitle('');
  }, []);

  const submit = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await addList(trimmed);
    setTitle('');
    inputRef.current?.focus();
  }, [addList, title]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    },
    [close, submit]
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-[272px] min-w-[272px] items-center gap-2 rounded-list px-3 py-[10px] bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[14px] font-medium">Add another list</span>
      </button>
    );
  }

  return (
    <div className="w-[272px] min-w-[272px] rounded-list bg-surface-overlay p-2">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter list name..."
        className="w-full rounded-[4px] border border-[#738496] bg-surface-input px-2 py-[6px] text-[14px] text-text-default placeholder-text-subtlest focus:outline-none focus:border-[#85b8ff] focus:ring-1 focus:ring-[#85b8ff]"
      />
      <div className="flex items-center gap-1 mt-2">
        <button
          onClick={submit}
          className="rounded-[3px] bg-[#579dff] px-3 py-[6px] text-[14px] font-medium text-[#1d2125] hover:bg-[#85b8ff] transition-colors"
        >
          Add list
        </button>
        <button
          onClick={close}
          className="flex h-8 w-8 items-center justify-center rounded-[4px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors"
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
