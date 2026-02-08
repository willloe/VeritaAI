import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/store';

const COVER_COLORS: Record<string, string> = {
  blue: '#579dff',
  green: '#4bce97',
  red: '#f87462',
  purple: '#9f8fef',
  orange: '#fea362',
  yellow: '#f5cd47',
  sky: '#6cc3e0',
  lime: '#94c748',
  pink: '#e774bb',
};

const EMOJI_MAP: Record<string, string> = {
  blue: '\ud83d\udd12',
  green: '\ud83c\udf89',
  red: '\ud83d\ude2c',
  purple: '\ud83c\udfa8',
  orange: '\ud83e\udd14',
  yellow: '\u2b50',
};

export function CardModal() {
  const selectedCardId = useBoardStore((s) => s.selectedCardId);
  const cards = useBoardStore((s) => s.cards);
  const lists = useBoardStore((s) => s.lists);
  const setSelectedCard = useBoardStore((s) => s.setSelectedCard);
  const updateCard = useBoardStore((s) => s.updateCard);
  const toggleCardComplete = useBoardStore((s) => s.toggleCardComplete);

  const card = cards.find((c) => c.id === selectedCardId);
  const list = card ? lists.find((l) => l.id === card.listId) : null;

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(card?.description || '');
  const modalRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setSelectedCard(null);
    setIsEditingDesc(false);
  }, [setSelectedCard]);

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

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) close();
    },
    [close]
  );

  const handleSaveDesc = useCallback(() => {
    if (card) updateCard(card.id, { description: descValue });
    setIsEditingDesc(false);
  }, [card, descValue, updateCard]);

  const handleToggleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (card) toggleCardComplete(card.id);
    },
    [card, toggleCardComplete]
  );

  if (!card) return null;

  const hasCover = !!card.coverColor;
  const coverBg = card.coverColor ? COVER_COLORS[card.coverColor] : undefined;
  const emoji = card.coverColor ? EMOJI_MAP[card.coverColor] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-y-auto"
      style={{ backgroundColor: 'var(--backdrop)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[768px] rounded-modal shadow-modal mx-4 overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Card: ${card.title}`}
      >
        {/* Cover banner */}
        {hasCover && (
          <div
            className="relative flex items-center justify-center min-h-[160px] px-6"
            style={{ backgroundColor: coverBg }}
          >
            {/* List badge top-left */}
            {list && (
              <span className="absolute top-3 left-3 flex items-center gap-1 rounded-[3px] bg-black/20 px-2 py-[2px] text-[12px] font-semibold text-white">
                {list.title}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="opacity-70">
                  <path d="M3 4l2 2 2-2" />
                </svg>
              </span>
            )}

            {/* Cover action icons top-right */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-black/20 text-white hover:bg-black/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                  <circle cx="6" cy="7" r="2" />
                  <path d="M2 12l3-3 2 2 3-4 4 5" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-black/20 text-white hover:bg-black/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="13" cy="8" r="1.5" />
                </svg>
              </button>
              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-black/20 text-white hover:bg-black/30 transition-colors"
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            {/* Centered emoji + title on cover */}
            <div className="flex items-center gap-3">
              {emoji && <span className="text-[32px]">{emoji}</span>}
              <span className="text-[28px] font-bold text-white leading-9 drop-shadow-sm">
                {card.title}
              </span>
            </div>
          </div>
        )}

        {/* Close button (when no cover) */}
        {!hasCover && (
          <button
            onClick={close}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-[4px] text-[#626f86] hover:bg-[#091e420f] transition-colors z-10"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}

        {/* Modal body */}
        <div className="p-6">
          {/* Title area with completion circle */}
          <div className="flex items-start gap-3 pr-10 mb-2">
            <button
              onClick={handleToggleComplete}
              className="mt-[6px] flex-shrink-0"
              aria-label={card.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {card.completed ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" fill="#4bce97" />
                  <path d="M6.5 11.5l3 3 6-6" stroke="#1d2125" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9.5" stroke="#626f86" strokeWidth="1.5" />
                </svg>
              )}
            </button>
            <div>
              <h2 className="text-[20px] font-semibold leading-7 text-[#172b4d]">{card.title}</h2>
              {list && !hasCover && (
                <p className="mt-0.5 text-[14px] text-[#44546f]">
                  in list <span className="underline decoration-dotted">{list.title}</span>
                </p>
              )}
            </div>
          </div>

          {/* Horizontal action pills */}
          <div className="flex flex-wrap items-center gap-2 mb-6 ml-[34px]">
            {[
              { label: '+ Add', icon: 'add' },
              { label: 'Labels', icon: 'labels' },
              { label: 'Dates', icon: 'dates' },
              { label: 'Checklist', icon: 'checklist' },
              { label: 'Members', icon: 'members' },
            ].map(({ label, icon }) => (
              <button
                key={label}
                className="flex items-center gap-1.5 rounded-[3px] bg-[#091e420f] px-3 py-[6px] text-[14px] text-[#172b4d] hover:bg-[#091e4224] transition-colors"
              >
                <ActionIcon action={icon} />
                {label}
              </button>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="flex gap-4">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Description section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#44546f]">
                      <path d="M3 5h14M3 9h10M3 13h12" strokeLinecap="round" />
                    </svg>
                    <h3 className="text-[16px] font-semibold text-[#172b4d]">Description</h3>
                  </div>
                  {card.description && !isEditingDesc && (
                    <button
                      onClick={() => {
                        setDescValue(card.description || '');
                        setIsEditingDesc(true);
                      }}
                      className="rounded-[3px] bg-[#091e420f] px-3 py-[4px] text-[14px] text-[#172b4d] hover:bg-[#091e4224] transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingDesc ? (
                  <div className="ml-8">
                    <textarea
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      className="w-full min-h-[108px] rounded-[4px] border border-[#091e4224] bg-white p-2 text-[14px] text-[#172b4d] placeholder-[#626f86] resize-y focus:outline-none focus:border-[#388bff] focus:ring-1 focus:ring-[#388bff]"
                      placeholder="Add a more detailed description..."
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveDesc}
                        className="rounded-[3px] bg-[#0c66e4] px-3 py-[6px] text-[14px] font-medium text-white hover:bg-[#0055cc] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className="rounded-[3px] px-3 py-[6px] text-[14px] text-[#44546f] hover:bg-[#091e420f] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="ml-8 cursor-pointer rounded-[4px] text-[14px] leading-[22px] text-[#44546f] hover:bg-[#091e420f] transition-colors"
                    onClick={() => {
                      setDescValue(card.description || '');
                      setIsEditingDesc(true);
                    }}
                  >
                    {card.description ? (
                      <div className="whitespace-pre-wrap text-[#172b4d] py-1">
                        {card.description}
                      </div>
                    ) : (
                      <div className="min-h-[56px] rounded-[4px] bg-[#091e420f] p-3">
                        Add a more detailed description...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Attachments section */}
              {card.badgeAttachments && card.badgeAttachments > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#44546f]">
                        <path d="M10 4L5.5 8.5a3.5 3.5 0 0 0 5 5L15 9a2.5 2.5 0 0 0-3.5-3.5L7 10a1.5 1.5 0 0 0 2 2l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h3 className="text-[16px] font-semibold text-[#172b4d]">Attachments</h3>
                    </div>
                    <button className="rounded-[3px] bg-[#091e420f] px-3 py-[4px] text-[14px] text-[#172b4d] hover:bg-[#091e4224] transition-colors">
                      Add
                    </button>
                  </div>
                  <div className="ml-8">
                    <p className="text-[12px] text-[#626f86] mb-2">Files</p>
                    <div className="flex items-center gap-3 rounded-[8px] p-2 hover:bg-[#091e420f] transition-colors">
                      {/* File thumbnail */}
                      <div
                        className="flex h-[48px] w-[64px] flex-shrink-0 items-center justify-center rounded-[4px] text-[10px] font-bold text-[#1d2125]"
                        style={{ backgroundColor: coverBg || '#579dff' }}
                      >
                        {emoji && <span className="text-[14px] mr-0.5">{emoji}</span>}
                        <span className="text-[9px]">{card.title}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-[#172b4d] font-medium truncate">{card.title}.png</p>
                        <p className="text-[12px] text-[#626f86]">Added Jan 2, 2019, 5:52 PM &bull; Cover</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[#626f86] hover:bg-[#091e420f] transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M2 12l4-4M10 2l2 2" />
                            <path d="M6 8l4-4" />
                          </svg>
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[#626f86] hover:bg-[#091e420f] transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <circle cx="3" cy="7" r="1.2" />
                            <circle cx="7" cy="7" r="1.2" />
                            <circle cx="11" cy="7" r="1.2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Comments and activity */}
            <div className="w-[280px] flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#44546f]">
                    <rect x="2" y="3" width="14" height="12" rx="2" />
                    <path d="M5 7h8M5 10h5" strokeLinecap="round" />
                  </svg>
                  <h3 className="text-[14px] font-semibold text-[#172b4d]">Comments and activity</h3>
                </div>
                <button className="rounded-[3px] border border-[#091e4224] px-2.5 py-[3px] text-[12px] text-[#172b4d] hover:bg-[#091e420f] transition-colors">
                  Show details
                </button>
              </div>
              <div className="rounded-[8px] border border-[#091e4224] bg-white p-3 text-[14px] text-[#626f86] cursor-pointer hover:border-[#388bff] transition-colors">
                Write a comment...
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tabs bar */}
        <div className="flex items-center justify-center gap-0 border-t border-[#091e4224] px-6 py-2" style={{ backgroundColor: '#282e33' }}>
          {[
            { label: 'Power-ups', icon: 'powerup' },
            { label: 'Automations', icon: 'automation' },
            { label: 'Comments', icon: 'comments', active: true },
          ].map(({ label, icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-1.5 px-4 py-2 text-[14px] transition-colors rounded-[4px] ${
                active
                  ? 'text-[#579dff] border-b-2 border-[#579dff]'
                  : 'text-[#9fadbc] hover:bg-[#3d474f]'
              }`}
            >
              <TabIcon icon={icon} active={!!active} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const cls = 'w-4 h-4 text-[#626f86]';
  switch (action) {
    case 'add':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 2v12M2 8h12" />
        </svg>
      );
    case 'labels':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4a2 2 0 012-2h4l6 6-6 6-6-6V4z" strokeLinejoin="round" />
          <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'dates':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="11" rx="1.5" />
          <path d="M2 6.5h12M5 2v2M11 2v2" strokeLinecap="round" />
        </svg>
      );
    case 'checklist':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 4l2 2 4-4M3 10l2 2 4-4" />
        </svg>
      );
    case 'members':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="5" r="3" />
          <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? 'text-[#579dff]' : 'text-[#9fadbc]';
  const cls = `w-4 h-4 ${color}`;
  switch (icon) {
    case 'powerup':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2l2 5h3l-4 3.5 1.5 4.5L8 12l-2.5 3 1.5-4.5L3 7h3l2-5z" />
        </svg>
      );
    case 'automation':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2L5 9h6l-4 7" />
        </svg>
      );
    case 'comments':
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="9" rx="2" />
          <path d="M5 7h6M5 9.5h3" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
