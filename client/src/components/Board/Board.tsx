import { useEffect, useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBoardStore } from '@/store';
import { BoardList } from '../List/BoardList';
import { AddListComposer } from '../List/AddListComposer';
import { CardTile } from '../Card/CardTile';
import { CardModal } from '../CardModal/CardModal';
import { DemoPanel } from '../DemoPanel/DemoPanel';
import { BoardListOverlay } from '../List/BoardListOverlay';

interface BoardProps {
  demo?: boolean;
}

export function Board({ demo }: BoardProps) {
  const {
    board,
    lists,
    cards,
    loading,
    fetchBoard,
    moveCard,
    persistMove,
    moveList,
    persistListOrder,
    setDraggingCard,
    setDraggingList,
    selectedCardId,
  } = useBoardStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'list' | null>(null);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id as string;
      const type = event.active.data.current?.type as 'card' | 'list' | undefined;

      setActiveId(id);

      if (type === 'list') {
        setActiveType('list');
        setDraggingList(id);
      } else {
        setActiveType('card');
        setDraggingCard(id);
      }
    },
    [setDraggingCard, setDraggingList]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeType = active.data.current?.type;
      if (activeType === 'list') return; // List reorder handled in dragEnd

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeCard = cards.find((c) => c.id === activeId);
      if (!activeCard) return;

      // Determine target list
      const overCard = cards.find((c) => c.id === overId);
      const overType = over.data.current?.type;
      const targetListId = overType === 'list' ? overId : (overCard ? overCard.listId : overId);

      // Check if it's a valid list
      const targetList = lists.find((l) => l.id === targetListId);
      if (!targetList) return;

      if (activeCard.listId !== targetListId) {
        // Moving across lists
        const targetCards = cards
          .filter((c) => c.listId === targetListId && c.id !== activeId)
          .sort((a, b) => a.position - b.position);

        let toIndex = targetCards.length; // default: end of list
        if (overCard) {
          const overIdx = targetCards.findIndex((c) => c.id === overId);
          toIndex = overIdx >= 0 ? overIdx : targetCards.length;
        }

        moveCard({
          cardId: activeId,
          fromListId: activeCard.listId,
          toListId: targetListId,
          toIndex,
        });
      }
    },
    [cards, lists, moveCard]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const dragType = active.data.current?.type;

      setActiveId(null);
      setActiveType(null);
      setDraggingCard(null);
      setDraggingList(null);

      if (!over) return;

      if (dragType === 'list') {
        // List reordering
        const activeListId = active.id as string;
        const overListId = over.id as string;

        if (activeListId !== overListId) {
          const fromIndex = lists.findIndex((l) => l.id === activeListId);
          const toIndex = lists.findIndex((l) => l.id === overListId);
          if (fromIndex >= 0 && toIndex >= 0) {
            moveList(fromIndex, toIndex);
            persistListOrder();
          }
        }
        return;
      }

      // Card reordering
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeCard = cards.find((c) => c.id === activeId);
      if (!activeCard) return;

      const overCard = cards.find((c) => c.id === overId);
      const overType = over.data.current?.type;
      const targetListId = overType === 'list' ? overId : (overCard ? overCard.listId : overId);
      const targetList = lists.find((l) => l.id === targetListId);
      if (!targetList) return;

      // Calculate final index
      const listCards = cards
        .filter((c) => c.listId === targetListId)
        .sort((a, b) => a.position - b.position);

      let toIndex = listCards.findIndex((c) => c.id === activeId);
      if (toIndex < 0) toIndex = listCards.length - 1;

      if (overCard && overCard.id !== activeId) {
        const overIndex = listCards.findIndex((c) => c.id === overId);
        if (overIndex >= 0) {
          moveCard({
            cardId: activeId,
            fromListId: activeCard.listId,
            toListId: targetListId,
            toIndex: overIndex,
          });
          toIndex = overIndex;
        }
      }

      persistMove({
        cardId: activeId,
        fromListId: activeCard.listId,
        toListId: targetListId,
        toIndex,
      });
    },
    [cards, lists, moveCard, persistMove, moveList, persistListOrder, setDraggingCard, setDraggingList]
  );

  const activeCard = activeType === 'card' && activeId ? cards.find((c) => c.id === activeId) : null;
  const activeList = activeType === 'list' && activeId ? lists.find((l) => l.id === activeId) : null;

  const listIds = lists.map((l) => l.id);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-text-subtle text-sm">Loading board...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#0079bf] via-[#00aecc] to-[#4bc0c0]">
      {/* Board header */}
      <div className="flex h-[52px] items-center px-4 bg-black/30 backdrop-blur-sm">
        <h1 className="text-[18px] font-bold text-white">{board?.name || 'Kanban Template'}</h1>
      </div>

      {/* Board canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
          <div className="flex h-[calc(100vh-52px)] items-start gap-3 overflow-x-auto overflow-y-hidden p-3 pb-2">
            {lists.map((list) => (
              <BoardList key={list.id} list={list} />
            ))}
            <AddListComposer />
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeCard ? (
            <div className="rotate-[4deg] opacity-60 scale-[1.02]">
              <CardTile card={activeCard} isDragOverlay />
            </div>
          ) : activeList ? (
            <div className="rotate-[3deg] opacity-60 scale-[1.01]">
              <BoardListOverlay list={activeList} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Card detail modal */}
      {selectedCardId && <CardModal />}

      {/* Demo panel */}
      {demo && <DemoPanel />}
    </div>
  );
}
