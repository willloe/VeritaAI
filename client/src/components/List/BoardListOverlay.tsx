import type { List } from '@/types';
import { useBoardStore } from '@/store';
import { CardTile } from '../Card/CardTile';

interface BoardListOverlayProps {
  list: List;
}

export function BoardListOverlay({ list }: BoardListOverlayProps) {
  const cards = useBoardStore((s) =>
    s.cards
      .filter((c) => c.listId === list.id)
      .sort((a, b) => a.position - b.position)
  );

  return (
    <div className="flex w-[272px] min-w-[272px] flex-col rounded-list bg-surface-overlay max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-1">
        <h2 className="text-[14px] font-semibold leading-5 truncate text-text-default">
          {list.title}
        </h2>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-[6px] overflow-hidden px-2 py-0.5">
        {cards.map((card) => (
          <CardTile key={card.id} card={card} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center px-1 pb-1 pt-0.5">
        <div className="flex flex-1 items-center gap-2 rounded-[8px] px-2 py-[6px] text-text-subtle">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-subtle">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[14px]">Add a card</span>
        </div>
      </div>
    </div>
  );
}
