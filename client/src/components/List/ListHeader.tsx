import { useCallback } from 'react';
import type { List } from '@/types';
import { useBoardStore } from '@/store';

interface ListHeaderProps {
  list: List;
  cardCount: number;
  limit?: number;
  isOverLimit: boolean;
  isMenuOpen: boolean;
}

export function ListHeader({ list, cardCount, limit, isOverLimit, isMenuOpen }: ListHeaderProps) {
  const setOpenListMenu = useBoardStore((s) => s.setOpenListMenu);

  const toggleMenu = useCallback(() => {
    setOpenListMenu(isMenuOpen ? null : list.id);
  }, [isMenuOpen, list.id, setOpenListMenu]);

  return (
    <div className="flex items-center justify-between px-2 pt-2 pb-1">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <h2
          className={`text-[14px] font-semibold leading-5 truncate ${
            isOverLimit ? 'text-[#f87462]' : 'text-text-default'
          }`}
        >
          {list.title}
        </h2>
        {limit !== undefined && (
          <span
            className={`flex-shrink-0 rounded-full px-[6px] py-[1px] text-[12px] font-semibold leading-4 ${
              isOverLimit
                ? 'bg-[#f87462] text-[#1d2125]'
                : 'text-text-subtlest'
            }`}
          >
            {cardCount} / {limit}
          </span>
        )}
      </div>

      <button
        onClick={toggleMenu}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors duration-[85ms]"
        aria-label="List actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="13" cy="8" r="1.5" />
        </svg>
      </button>
    </div>
  );
}
