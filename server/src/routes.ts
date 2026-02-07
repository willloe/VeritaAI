import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data.json');

interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  coverColor?: string;
  badgeDescription?: boolean;
  badgeAttachments?: number;
  dueDate?: string;
  completed?: boolean;
}

interface BoardList {
  id: string;
  boardId: string;
  title: string;
  position: number;
  emoji?: string;
  headerColor?: string;
}

interface Board {
  id: string;
  name: string;
  backgroundUrl: string;
}

interface Data {
  board: Board;
  lists: BoardList[];
  cards: Card[];
}

function readData(): Data {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: Data): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

let nextId = 100;

export const router = Router();

// GET /board — full board with lists and cards
router.get('/board', (_req: Request, res: Response) => {
  const data = readData();
  data.lists.sort((a, b) => a.position - b.position);
  data.cards.sort((a, b) => a.position - b.position);
  res.json(data);
});

// POST /lists/:listId/cards — add a card
router.post('/lists/:listId/cards', (req: Request, res: Response) => {
  const { listId } = req.params;
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const data = readData();
  const listCards = data.cards.filter((c) => c.listId === listId);
  const maxPos = listCards.length > 0 ? Math.max(...listCards.map((c) => c.position)) + 1 : 0;

  const card: Card = {
    id: `card-${++nextId}`,
    listId,
    title: title.trim(),
    position: maxPos,
  };

  data.cards.push(card);
  writeData(data);
  res.status(201).json(card);
});

// PATCH /cards/:cardId — update card
router.patch('/cards/:cardId', (req: Request, res: Response) => {
  const { cardId } = req.params;
  const data = readData();
  const card = data.cards.find((c) => c.id === cardId);

  if (!card) {
    res.status(404).json({ error: 'Card not found' });
    return;
  }

  if (req.body.title !== undefined) card.title = req.body.title;
  if (req.body.description !== undefined) card.description = req.body.description;
  if (req.body.completed !== undefined) card.completed = req.body.completed;

  writeData(data);
  res.json(card);
});

// POST /cards/move — move/reorder a card
router.post('/cards/move', (req: Request, res: Response) => {
  const { cardId, fromListId, toListId, toIndex } = req.body;

  if (!cardId || !toListId || toIndex === undefined) {
    res.status(400).json({ error: 'cardId, toListId, and toIndex are required' });
    return;
  }

  const data = readData();
  const card = data.cards.find((c) => c.id === cardId);

  if (!card) {
    res.status(404).json({ error: 'Card not found' });
    return;
  }

  // Remove from old list ordering
  const oldListCards = data.cards
    .filter((c) => c.listId === (fromListId || card.listId) && c.id !== cardId)
    .sort((a, b) => a.position - b.position);
  oldListCards.forEach((c, i) => {
    c.position = i;
  });

  // Update card's list
  card.listId = toListId;

  // Get target list cards (excluding the moved card, then insert)
  const targetCards = data.cards
    .filter((c) => c.listId === toListId && c.id !== cardId)
    .sort((a, b) => a.position - b.position);

  const clampedIndex = Math.min(toIndex, targetCards.length);
  targetCards.splice(clampedIndex, 0, card);
  targetCards.forEach((c, i) => {
    c.position = i;
  });

  writeData(data);
  res.json({ success: true });
});

// POST /lists — add a new list
router.post('/lists', (req: Request, res: Response) => {
  const { title, boardId } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const data = readData();
  const maxPos = data.lists.length > 0 ? Math.max(...data.lists.map((l) => l.position)) + 1 : 0;

  const list: BoardList = {
    id: `list-${++nextId}`,
    boardId: boardId || 'board-1',
    title: title.trim(),
    position: maxPos,
  };

  data.lists.push(list);
  writeData(data);
  res.status(201).json(list);
});

// POST /lists/reorder — reorder lists
router.post('/lists/reorder', (req: Request, res: Response) => {
  const { listIds } = req.body;

  if (!Array.isArray(listIds)) {
    res.status(400).json({ error: 'listIds array is required' });
    return;
  }

  const data = readData();
  listIds.forEach((id: string, index: number) => {
    const list = data.lists.find((l) => l.id === id);
    if (list) list.position = index;
  });

  writeData(data);
  res.json({ success: true });
});

// PATCH /lists/:listId — update list title
router.patch('/lists/:listId', (req: Request, res: Response) => {
  const { listId } = req.params;
  const data = readData();
  const list = data.lists.find((l) => l.id === listId);

  if (!list) {
    res.status(404).json({ error: 'List not found' });
    return;
  }

  if (req.body.title !== undefined) list.title = req.body.title;

  writeData(data);
  res.json({ success: true });
});
