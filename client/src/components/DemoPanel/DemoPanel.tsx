import { useCallback } from 'react';
import { useBoardStore } from '@/store';

/**
 * State-forcing sandbox panel (dev-only).
 * Available at /demo route. Provides toggles to force UI states
 * for rapid visual QA and screenshot comparison.
 */
export function DemoPanel() {
  const lists = useBoardStore((s) => s.lists);
  const cards = useBoardStore((s) => s.cards);
  const selectedCardId = useBoardStore((s) => s.selectedCardId);
  const openListMenuId = useBoardStore((s) => s.openListMenuId);
  const addComposerListId = useBoardStore((s) => s.addComposerListId);
  const setSelectedCard = useBoardStore((s) => s.setSelectedCard);
  const setOpenListMenu = useBoardStore((s) => s.setOpenListMenu);
  const setAddComposer = useBoardStore((s) => s.setAddComposer);

  const toggleMenu = useCallback(
    (listId: string) => {
      setOpenListMenu(openListMenuId === listId ? null : listId);
    },
    [openListMenuId, setOpenListMenu]
  );

  const toggleComposer = useCallback(
    (listId: string) => {
      setAddComposer(addComposerListId === listId ? null : listId);
    },
    [addComposerListId, setAddComposer]
  );

  const toggleModal = useCallback(
    (cardId: string) => {
      setSelectedCard(selectedCardId === cardId ? null : cardId);
    },
    [selectedCardId, setSelectedCard]
  );

  return (
    <div className="fixed bottom-0 left-0 z-[100] max-h-[320px] w-[340px] overflow-y-auto rounded-tr-lg bg-[#0d1117] border border-[#30363d] shadow-2xl">
      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-3 py-2">
        <h3 className="text-[13px] font-bold text-[#f0f6fc] tracking-wide uppercase">
          Demo Panel — State Sandbox
        </h3>
        <p className="text-[11px] text-[#8b949e] mt-0.5">Force UI states for QA</p>
      </div>

      <div className="p-3 space-y-3">
        {/* List menu toggles */}
        <Section title="List Menus">
          {lists.map((l) => (
            <Toggle
              key={l.id}
              label={`Menu: ${l.title}`}
              active={openListMenuId === l.id}
              onClick={() => toggleMenu(l.id)}
            />
          ))}
        </Section>

        {/* Composer toggles */}
        <Section title="Add Card Composer">
          {lists.map((l) => (
            <Toggle
              key={l.id}
              label={`Composer: ${l.title}`}
              active={addComposerListId === l.id}
              onClick={() => toggleComposer(l.id)}
            />
          ))}
        </Section>

        {/* Card modal toggles */}
        <Section title="Card Modal">
          {cards.slice(0, 8).map((c) => (
            <Toggle
              key={c.id}
              label={`Modal: ${c.title.slice(0, 30)}${c.title.length > 30 ? '...' : ''}`}
              active={selectedCardId === c.id}
              onClick={() => toggleModal(c.id)}
            />
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-1">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center justify-between rounded px-2 py-1 text-[12px] transition-colors
        ${active ? 'bg-[#1f6feb] text-white' : 'bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d]'}
      `}
    >
      <span className="truncate">{label}</span>
      <span className={`ml-2 text-[10px] font-mono ${active ? 'text-white/80' : 'text-[#484f58]'}`}>
        {active ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
