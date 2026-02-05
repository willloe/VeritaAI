import { create } from 'zustand';
import type { Board, Card, List, MoveCardPayload } from '@/types';
import { api } from '@/api';

interface UIState {
  selectedCardId: string | null;
  openListMenuId: string | null;
  addComposerListId: string | null;
  draggingCardId: string | null;
  hoveredCardId: string | null;
}

interface BoardState extends UIState {
  board: Board | null;
  lists: List[];
  cards: Card[];
  loading: boolean;

  // Data actions
  fetchBoard: () => Promise<void>;
  addCard: (listId: string, title: string) => Promise<void>;
  updateCard: (cardId: string, data: Partial<Pick<Card, 'title' | 'description'>>) => Promise<void>;
  moveCard: (payload: MoveCardPayload) => void;
  persistMove: (payload: MoveCardPayload) => Promise<void>;

  // UI actions
  setSelectedCard: (id: string | null) => void;
  setOpenListMenu: (id: string | null) => void;
  setAddComposer: (id: string | null) => void;
  setDraggingCard: (id: string | null) => void;
  setHoveredCard: (id: string | null) => void;

  // Selectors
  getCardsByList: (listId: string) => Card[];
  getCardById: (id: string) => Card | undefined;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  lists: [],
  cards: [],
  loading: true,
  selectedCardId: null,
  openListMenuId: null,
  addComposerListId: null,
  draggingCardId: null,
  hoveredCardId: null,

  fetchBoard: async () => {
    set({ loading: true });
    try {
      const data = await api.getBoard();
      set({
        board: data.board,
        lists: data.lists.sort((a, b) => a.position - b.position),
        cards: data.cards.sort((a, b) => a.position - b.position),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  addCard: async (listId, title) => {
    const card = await api.addCard(listId, title);
    set((s) => ({ cards: [...s.cards, card] }));
  },

  updateCard: async (cardId, data) => {
    const updated = await api.updateCard(cardId, data);
    set((s) => ({
      cards: s.cards.map((c) => (c.id === cardId ? { ...c, ...updated } : c)),
    }));
  },

  moveCard: (payload) => {
    const { cardId, toListId, toIndex } = payload;
    set((s) => {
      const card = s.cards.find((c) => c.id === cardId);
      if (!card) return s;

      // Remove card from current position
      const withoutCard = s.cards.filter((c) => c.id !== cardId);

      // Get cards in target list
      const targetCards = withoutCard
        .filter((c) => c.listId === toListId)
        .sort((a, b) => a.position - b.position);

      // Insert at index
      const movedCard = { ...card, listId: toListId };
      targetCards.splice(toIndex, 0, movedCard);

      // Re-number positions for target list
      targetCards.forEach((c, i) => {
        c.position = i;
      });

      // Rebuild full card array
      const otherCards = withoutCard.filter((c) => c.listId !== toListId);
      return { cards: [...otherCards, ...targetCards].sort((a, b) => a.position - b.position) };
    });
  },

  persistMove: async (payload) => {
    try {
      await api.moveCard(payload);
    } catch {
      // Refetch on error to re-sync
      get().fetchBoard();
    }
  },

  setSelectedCard: (id) => set({ selectedCardId: id }),
  setOpenListMenu: (id) => set({ openListMenuId: id }),
  setAddComposer: (id) => set({ addComposerListId: id }),
  setDraggingCard: (id) => set({ draggingCardId: id }),
  setHoveredCard: (id) => set({ hoveredCardId: id }),

  getCardsByList: (listId) =>
    get()
      .cards.filter((c) => c.listId === listId)
      .sort((a, b) => a.position - b.position),

  getCardById: (id) => get().cards.find((c) => c.id === id),
}));
