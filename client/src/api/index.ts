import type { BoardData, Card, List, MoveCardPayload } from '@/types';

const BASE = '/api';

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  getBoard(): Promise<BoardData> {
    return json<BoardData>(`${BASE}/board`);
  },

  addCard(listId: string, title: string): Promise<Card> {
    return json<Card>(`${BASE}/lists/${listId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  },

  updateCard(cardId: string, data: Partial<Pick<Card, 'title' | 'description' | 'completed'>>): Promise<Card> {
    return json<Card>(`${BASE}/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  moveCard(payload: MoveCardPayload): Promise<{ success: boolean }> {
    return json<{ success: boolean }>(`${BASE}/cards/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  addList(title: string, boardId?: string): Promise<List> {
    return json<List>(`${BASE}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, boardId: boardId || 'board-1' }),
    });
  },

  reorderLists(listIds: string[]): Promise<{ success: boolean }> {
    return json<{ success: boolean }>(`${BASE}/lists/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listIds }),
    });
  },

  updateListTitle(listId: string, title: string): Promise<{ success: boolean }> {
    return json<{ success: boolean }>(`${BASE}/lists/${listId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  },
};
