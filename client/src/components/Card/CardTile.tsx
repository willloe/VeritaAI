import { useCallback, useState, useEffect } from 'react';
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
  const toggleCardComplete = useBoardStore((s) => s.toggleCardComplete);
  const draggingCardId = useBoardStore((s) => s.draggingCardId);
  const [isHovered, setIsHovered] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const isBeingDragged = draggingCardId === card.id;

  useEffect(() => {
    if (justCompleted) {
      const timer = setTimeout(() => setJustCompleted(false), 700);
      return () => clearTimeout(timer);
    }
  }, [justCompleted]);

  const handleClick = useCallback(() => {
    if (!isDragOverlay) {
      setSelectedCard(card.id);
    }
  }, [card.id, isDragOverlay, setSelectedCard]);

  const handleToggleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!card.completed) {
        setJustCompleted(true);
      }
      toggleCardComplete(card.id);
    },
    [card.id, card.completed, toggleCardComplete]
  );

  const hasCover = !!card.coverColor;
  const coverBg = card.coverColor ? COVER_COLORS[card.coverColor] : undefined;
  const emoji = card.coverColor ? EMOJI_MAP[card.coverColor] : undefined;

  const showCircle = (isHovered || card.completed) && !isDragOverlay && !hasCover;

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
        <div className="flex items-start gap-[6px]">
          {/* Completion circle */}
          {showCircle && (
            <CompletionButton
              completed={!!card.completed}
              justCompleted={justCompleted}
              onClick={handleToggleComplete}
            />
          )}

          <div className="flex flex-1 flex-col gap-1 min-w-0">
            {hasCover ? (
              <span className="text-[14px] leading-5 text-text-default">{card.title}</span>
            ) : (
              <span className="text-[14px] leading-5 break-words text-text-default">
                {card.title}
              </span>
            )}
            <CardBadges card={card} />
          </div>
        </div>
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

/** Animated completion circle with checkmark + radiating burst lines */
function CompletionButton({
  completed,
  justCompleted,
  onClick,
}: {
  completed: boolean;
  justCompleted: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 mt-[2px] flex items-center justify-center w-[18px] h-[18px] group/check"
      aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      title={completed ? 'Mark incomplete' : 'Mark complete'}
    >
      {/* Radiating burst lines */}
      {justCompleted && (
        <div className="absolute inset-[-6px] pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 origin-center"
              style={{
                width: '2px',
                height: '8px',
                backgroundColor: '#4bce97',
                borderRadius: '1px',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animation: `burst-line 500ms ease-out forwards`,
                animationDelay: `${i * 20}ms`,
              }}
            />
          ))}
        </div>
      )}

      {completed ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={justCompleted ? { animation: 'check-pop 300ms ease-out' } : undefined}
        >
          <circle cx="9" cy="9" r="8" fill="#4bce97" />
          <path
            d="M5.5 9.5l2 2 5-5"
            stroke="#1d2125"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              justCompleted
                ? {
                    strokeDasharray: 12,
                    strokeDashoffset: 12,
                    animation: 'check-draw 300ms ease-out 100ms forwards',
                  }
                : undefined
            }
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle
            cx="9"
            cy="9"
            r="7.5"
            stroke="#738496"
            strokeWidth="1.5"
            className="group-hover/check:stroke-[#b6c2cf] transition-colors"
          />
        </svg>
      )}
    </button>
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
