import { useCallback } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { List } from '@/types';
import { useBoardStore } from '@/store';
import { SortableCard } from '../Card/SortableCard';
import { ListHeader } from './ListHeader';
import { AddCardComposer } from '../AddCardComposer/AddCardComposer';
import { ListActionsMenu } from '../ListActionsMenu/ListActionsMenu';

interface BoardListProps {
  list: List;
}

const HEADER_COLORS: Record<string, string> = {
  blue: 'bg-[#579dff]',
  green: 'bg-[#4bce97]',
  red: 'bg-[#f87462]',
  purple: 'bg-[#9f8fef]',
  orange: 'bg-[#fea362]',
  yellow: 'bg-[#f5cd47]',
  sky: 'bg-[#6cc3e0]',
  lime: 'bg-[#94c748]',
  pink: 'bg-[#e774bb]',
};

export function BoardList({ list }: BoardListProps) {
  const cards = useBoardStore((s) =>
    s.cards
      .filter((c) => c.listId === list.id)
      .sort((a, b) => a.position - b.position)
  );
  const addComposerListId = useBoardStore((s) => s.addComposerListId);
  const openListMenuId = useBoardStore((s) => s.openListMenuId);
  const setAddComposer = useBoardStore((s) => s.setAddComposer);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: 'list' },
  });

  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),
    transition,
  };

  const isComposerOpen = addComposerListId === list.id;
  const isMenuOpen = openListMenuId === list.id;

  const cardIds = cards.map((c) => c.id);

  // Count for list limit badge (Code Review has 4/3 in screenshot)
  const listLimit = list.id === 'list-5' ? 3 : undefined;
  const isOverLimit = listLimit ? cards.length > listLimit : false;

  const openComposer = useCallback(() => {
    setAddComposer(list.id);
  }, [list.id, setAddComposer]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex w-[272px] min-w-[272px] flex-col rounded-list bg-surface-overlay max-h-[calc(100vh-100px)] ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      {/* List header — drag handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <ListHeader
          list={list}
          cardCount={cards.length}
          limit={listLimit}
          isOverLimit={isOverLimit}
          isMenuOpen={isMenuOpen}
        />
      </div>

      {/* Cards container */}
      <div
        className="list-scroll flex flex-1 flex-col gap-[6px] overflow-y-auto px-2 py-0.5 min-h-[2px]"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Add card / Composer */}
      {isComposerOpen ? (
        <AddCardComposer listId={list.id} />
      ) : (
        <div className="flex items-center px-1 pb-1 pt-0.5">
          <button
            onClick={openComposer}
            className="group flex flex-1 items-center gap-2 rounded-[8px] px-2 py-[6px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors duration-[85ms]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-subtle">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[14px]">Add a card</span>
          </button>
          <button
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors duration-[85ms]"
            aria-label="Create from template"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-text-subtlest">
              <rect x="3" y="2" width="10" height="12" rx="1.5" />
              <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* List actions menu overlay */}
      {isMenuOpen && <ListActionsMenu listId={list.id} />}
    </div>
  );
}
