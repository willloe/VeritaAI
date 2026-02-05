import { useCallback, useState } from 'react';
import type { Card } from '@/types';
import { useBoardStore } from '@/store';

interface CardTileProps {
  card: Card;
  isDragging?: boolean;
  isDragOverlay?: boolean;
}

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

export function CardTile({ card, isDragging, isDragOverlay }: CardTileProps) {
  const setSelectedCard = useBoardStore((s) => s.setSelectedCard);
  const draggingCardId = useBoardStore((s) => s.draggingCardId);
  const [isHovered, setIsHovered] = useState(false);

  const isBeingDragged = draggingCardId === card.id;

  const handleClick = useCallback(() => {
    if (!isDragOverlay) {
      setSelectedCard(card.id);
    }
  }, [card.id, isDragOverlay, setSelectedCard]);

  const hasCover = !!card.coverColor;
  const coverBg = card.coverColor ? COVER_COLORS[card.coverColor] : undefined;
  const emoji = card.coverColor ? EMOJI_MAP[card.coverColor] : undefined;

  return (
    <div
      className={`
        group relative rounded-card cursor-pointer
        transition-all duration-[85ms]
        ${isBeingDragged && !isDragOverlay ? 'opacity-40' : 'opacity-100'}
        ${isDragOverlay ? 'shadow-card-dragging cursor-grabbing' : 'shadow-card hover:outline hover:outline-1 hover:outline-[#85b8ff]'}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Cover / Header Card */}
      {hasCover && (
        <div
          className="flex items-center gap-1.5 rounded-t-card px-3 py-[10px] min-h-[52px]"
          style={{ backgroundColor: coverBg }}
        >
          {emoji && <span className="text-[16px]">{emoji}</span>}
          <span className="text-[16px] font-bold text-[#1d2125] leading-5 truncate">
            {card.title}
          </span>
        </div>
      )}

      {/* Card body */}
      <div className={`bg-surface-raised px-2 py-[6px] ${hasCover ? 'rounded-b-card' : 'rounded-card'}`}>
        {hasCover ? (
          <div className="flex flex-col gap-1">
            <span className="text-[14px] leading-5 text-text-default">{card.title}</span>
            <CardBadges card={card} />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-[14px] leading-5 text-text-default break-words">{card.title}</span>
            <CardBadges card={card} />
          </div>
        )}
      </div>

      {/* Hover edit pencil */}
      {isHovered && !isDragOverlay && !isBeingDragged && (
        <button
          className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-card bg-surface-overlay opacity-90 hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCard(card.id);
          }}
          aria-label="Edit card"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="text-text-default"
          >
            <path
              d="M11.586 2.414a2 2 0 0 1 2.828 0l.172.172a2 2 0 0 1 0 2.828L6.5 13.5 2 14.5l1-4.5 8.586-8.586z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function CardBadges({ card }: { card: Card }) {
  const hasBadges = card.badgeDescription || card.badgeAttachments || card.dueDate;
  if (!hasBadges) return null;

  return (
    <div className="flex items-center gap-2 mt-0.5">
      {card.badgeDescription && (
        <span className="text-text-subtlest" title="This card has a description">
          <svg width="14" height="12" viewBox="0 0 16 14" fill="currentColor">
            <rect x="1" y="1" width="14" height="2" rx="1" />
            <rect x="1" y="5" width="10" height="2" rx="1" />
            <rect x="1" y="9" width="12" height="2" rx="1" />
          </svg>
        </span>
      )}
      {card.badgeAttachments && card.badgeAttachments > 0 && (
        <span className="flex items-center gap-0.5 text-[12px] leading-4 text-text-subtlest">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7.5 4L4 7.5a2.828 2.828 0 0 0 4 4L12 7.5a2 2 0 0 0-2.83-2.83L5.5 8.33a1 1 0 0 0 1.42 1.42L10.5 6.17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {card.badgeAttachments}
        </span>
      )}
      {card.dueDate && (
        <span
          className={`flex items-center gap-1 rounded-[3px] px-1 py-0 text-[12px] leading-4 ${
            card.completed
              ? 'bg-[#4bce97] text-[#1d2125]'
              : 'text-text-subtlest'
          }`}
        >
          {card.completed && (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 12.5l-4-4 1.5-1.5 2.5 2.5 5.5-5.5 1.5 1.5z" />
            </svg>
          )}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8.5" r="5" />
            <path d="M8 6v3l2 1" strokeLinecap="round" />
          </svg>
          {formatDate(card.dueDate)}
        </span>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
