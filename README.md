# Trello Kanban Board — Rapid Replication

A pixel-perfect replication of Trello's dark-theme Kanban board view, built as a cohesive component set with real persistence and full interaction fidelity.

## Reference UI

**Target:** Trello Kanban Board (dark theme) — the board canvas with horizontal list columns, card tiles, drag-and-drop, list actions menu, add card composer, and card detail modal.

Screenshots used as ground truth are located in `/reference/` (semantic names: `01_board_overview.png` through `07_drag_overlay_motion.png`).

## Replicated Components

| Component | States Implemented |
|---|---|
| **Board Canvas** | Background gradient, horizontal scroll, board header |
| **List Columns** | Header with title/badge/menu button, over-limit highlight (red `4/3`), scrollable card area |
| **Card Tiles** | Cover/header cards (colored top), plain cards, badges (description, attachments, due date), completed state |
| **Card Hover** | Pencil edit icon on hover, blue outline on hover, keyboard accessible |
| **List Actions Menu** | Full menu matching reference (Add card, Copy/Move list, Sort, Watch, Change list color section, Automation section, Power-Ups, Archive). Dismiss via click-outside or Escape. |
| **Add Card Composer** | Textarea with placeholder, Enter to submit, Escape/X to cancel, auto-focus, Tip button |
| **Card Detail Modal** | Dim backdrop, modal with title/list info/description/activity/sidebar actions, Escape closes, backdrop click closes, description editing with save/cancel |
| **Drag and Drop** | Cards reorderable within lists and across lists via dnd-kit, drag overlay with rotation + shadow, ghost placeholder |

## Tech Stack

### Frontend
- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS 3.4** with custom design tokens via CSS variables
- **@dnd-kit/core** + **@dnd-kit/sortable** for drag-and-drop
- **Zustand** for UI state management
- **React Router** for routing (`/` board, `/demo` sandbox)

### Backend
- **Express 4** + **TypeScript** (via tsx)
- **JSON file persistence** (`server/src/data.json`)

### AI Tools Used
- **Claude Code (Opus 4.6)** — Used for full implementation: architecture planning, component scaffolding, design token extraction, all source code generation, and polish iterations.

## How to Run

```bash
# Install all dependencies
npm run install:all

# Start both client (port 5173) and server (port 3001)
npm run dev
```

The client proxies `/api` requests to the server. Open `http://localhost:5173` for the board.

## Workflow Efficiency Report

### Method 1: Design Tokens + Tailwind Mapping

**File:** `client/src/styles/tokens.css`

All visual values (colors, shadows, radii, spacing, typography) are defined as CSS custom properties in a single `tokens.css` file. Tailwind is configured (`tailwind.config.ts`) to reference these tokens, creating a single source of truth.

**How this accelerates development:**
- Changing a color value in one place updates every component that uses it — no hunting through files.
- Comparing against reference screenshots is faster: if a surface color is off, fix the token once and verify globally.
- Prevents drift between components — every `bg-surface-raised`, `text-text-default`, or `shadow-card` resolves to the same token.

**Concrete example:** When I noticed the card surface color was slightly off from the reference, I changed `--surface-raised: #22272b` in `tokens.css` and every card, composer, and modal updated simultaneously.

### Method 2: State-Forcing Sandbox Route (`/demo`)

**File:** `client/src/components/DemoPanel/DemoPanel.tsx`

Navigating to `/demo` renders a floating panel at the bottom-left with toggles to force UI states:
- **List Menus:** Toggle any list's action menu open/closed
- **Add Card Composer:** Toggle any list's composer open/closed
- **Card Modal:** Toggle any card's detail modal open/closed

**How this accelerates development:**
- Eliminates manual clicking to reach a specific state for visual comparison.
- Enables rapid A/B comparison: force a state, screenshot, compare against reference, adjust tokens, repeat.
- Useful for QA: systematically walk through every list's menu and every card's modal without manual navigation.

## Scope Boundaries

**Included:**
- Board view with 7 lists and 13 cards matching the Trello Kanban Template
- All interactions specified (DnD, menu, composer, modal, hover states)
- Real persistence (JSON file — survives server restart)
- Keyboard accessibility (Escape closes, Enter submits, Tab navigation, focus-visible rings)

**Explicitly excluded:**
- Global navigation bar, workspace switcher, board settings
- User authentication, member avatars
- Billing/upgrade flows (shown as static text in menu)
- Board background image upload (uses CSS gradient)
- Card labels, checklists, attachments (badge counts only)
- Real-time collaboration / WebSocket sync

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── api/              # Typed fetch helpers
│   │   ├── components/
│   │   │   ├── AddCardComposer/
│   │   │   ├── Board/
│   │   │   ├── Card/         # CardTile + SortableCard
│   │   │   ├── CardModal/
│   │   │   ├── DemoPanel/    # /demo sandbox
│   │   │   ├── List/         # BoardList + ListHeader
│   │   │   └── ListActionsMenu/
│   │   ├── store/            # Zustand state
│   │   ├── styles/           # tokens.css + globals.css
│   │   └── types/            # TypeScript interfaces
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── server/
│   └── src/
│       ├── index.ts          # Express server
│       ├── routes.ts         # API endpoints
│       └── data.json         # Persistent data store
└── README.md
```
