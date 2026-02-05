import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/store';

export function CardModal() {
  const selectedCardId = useBoardStore((s) => s.selectedCardId);
  const cards = useBoardStore((s) => s.cards);
  const lists = useBoardStore((s) => s.lists);
  const setSelectedCard = useBoardStore((s) => s.setSelectedCard);
  const updateCard = useBoardStore((s) => s.updateCard);

  const card = cards.find((c) => c.id === selectedCardId);
  const list = card ? lists.find((l) => l.id === card.listId) : null;

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(card?.description || '');
  const descRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setSelectedCard(null);
    setIsEditingDesc(false);
  }, [setSelectedCard]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditingDesc) {
          setIsEditingDesc(false);
        } else {
          close();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close, isEditingDesc]);

  // Focus trap: focus modal on open
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close]
  );

  const handleSaveDesc = useCallback(() => {
    if (card) {
      updateCard(card.id, { description: descValue });
    }
    setIsEditingDesc(false);
  }, [card, descValue, updateCard]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-y-auto"
      style={{ backgroundColor: 'var(--backdrop)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[768px] rounded-modal bg-surface-overlay shadow-modal mx-4"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Card: ${card.title}`}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-[4px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors z-10"
          aria-label="Close modal"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="p-6">
          {/* Title area */}
          <div className="flex items-start gap-3 pr-10 mb-6">
            {/* Card icon */}
            <div className="mt-1 text-text-subtle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="16" height="14" rx="2" />
                <path d="M2 7h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-[20px] font-semibold leading-6 text-text-default">{card.title}</h2>
              {list && (
                <p className="mt-1 text-[14px] text-text-subtle">
                  in list <span className="underline decoration-dotted">{list.title}</span>
                </p>
              )}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex gap-4">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Description section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle">
                    <path d="M3 5h14M3 9h10M3 13h12" strokeLinecap="round" />
                  </svg>
                  <h3 className="text-[16px] font-semibold text-text-default">Description</h3>
                </div>

                {isEditingDesc ? (
                  <div className="ml-8">
                    <textarea
                      ref={descRef}
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      className="w-full min-h-[108px] rounded-[4px] border border-[#738496] bg-surface-input p-2 text-[14px] text-text-default placeholder-text-subtlest resize-y focus:outline-none focus:border-[#85b8ff] focus:ring-1 focus:ring-[#85b8ff]"
                      placeholder="Add a more detailed description..."
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveDesc}
                        className="rounded-[3px] bg-[#579dff] px-3 py-[6px] text-[14px] font-medium text-[#1d2125] hover:bg-[#85b8ff] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className="rounded-[3px] px-3 py-[6px] text-[14px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="ml-8 min-h-[56px] cursor-pointer rounded-[4px] bg-surface-overlay-hovered p-3 text-[14px] text-text-subtle hover:bg-[#3d474f] transition-colors"
                    onClick={() => {
                      setDescValue(card.description || '');
                      setIsEditingDesc(true);
                    }}
                  >
                    {card.description || 'Add a more detailed description...'}
                  </div>
                )}
              </div>

              {/* Activity section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle">
                      <rect x="2" y="3" width="16" height="14" rx="2" />
                      <path d="M6 7h8M6 11h5" strokeLinecap="round" />
                    </svg>
                    <h3 className="text-[16px] font-semibold text-text-default">Comments and activity</h3>
                  </div>
                  <button className="rounded-[3px] border border-[#738496] px-3 py-[4px] text-[14px] text-text-default hover:bg-surface-overlay-hovered transition-colors">
                    Show details
                  </button>
                </div>

                {/* Comment input */}
                <div className="ml-8">
                  <div className="rounded-[8px] border border-[#738496] bg-surface-input p-3 text-[14px] text-text-subtlest cursor-pointer hover:border-[#85b8ff] transition-colors">
                    Write a comment...
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar actions */}
            <div className="w-[168px] flex-shrink-0">
              <div className="flex flex-col gap-2">
                {['Add', 'Labels', 'Dates', 'Checklist', 'Members'].map((label) => (
                  <button
                    key={label}
                    className="flex items-center gap-2 rounded-[3px] bg-surface-overlay-hovered px-3 py-[6px] text-[14px] text-text-default hover:bg-[#3d474f] transition-colors text-left"
                  >
                    <ActionIcon action={label} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const className = 'w-4 h-4 text-text-subtle';
  switch (action) {
    case 'Add':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 2v12M2 8h12" />
        </svg>
      );
    case 'Labels':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4a2 2 0 012-2h4l6 6-6 6-6-6V4z" strokeLinejoin="round" />
          <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'Dates':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="11" rx="1.5" />
          <path d="M2 6.5h12M5 2v2M11 2v2" strokeLinecap="round" />
        </svg>
      );
    case 'Checklist':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 4l2 2 4-4M3 10l2 2 4-4" />
        </svg>
      );
    case 'Members':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="5" r="3" />
          <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
