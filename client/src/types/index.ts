export interface Board {
  id: string;
  name: string;
  backgroundUrl: string;
}

export type CoverColor =
  | 'blue'
  | 'green'
  | 'red'
  | 'purple'
  | 'orange'
  | 'yellow'
  | 'sky'
  | 'lime'
  | 'pink';

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  coverColor?: CoverColor;
  badgeDescription?: boolean;
  badgeAttachments?: number;
  dueDate?: string;
  completed?: boolean;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  position: number;
  emoji?: string;
  headerColor?: CoverColor;
}

export interface BoardData {
  board: Board;
  lists: List[];
  cards: Card[];
}

export interface MoveCardPayload {
  cardId: string;
  fromListId: string;
  toListId: string;
  toIndex: number;
}
