import { useCallback, useEffect, useRef } from 'react';
import { useBoardStore } from '@/store';

interface ListActionsMenuProps {
  listId: string;
}

export function ListActionsMenu({ listId }: ListActionsMenuProps) {
  const setOpenListMenu = useBoardStore((s) => s.setOpenListMenu);
  const setAddComposer = useBoardStore((s) => s.setAddComposer);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpenListMenu(null);
  }, [setOpenListMenu]);

  // Click outside to dismiss
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [close]);

  // Escape to dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  const handleAddCard = useCallback(() => {
    setAddComposer(listId);
    close();
  }, [close, listId, setAddComposer]);

  return (
    <>
      {/* Backdrop to catch outside clicks */}
      <div className="fixed inset-0 z-40" onClick={close} />

      {/* Menu positioned relative to parent list */}
      <div
        ref={menuRef}
        className="absolute top-[40px] left-1 z-50 w-[304px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-[8px] bg-surface-overlay shadow-overlay py-3"
        onClick={(e) => e.stopPropagation()}
        role="menu"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-3 pb-2 mb-1">
          <h3 className="text-[14px] font-semibold text-text-default">List actions</h3>
          <button
            onClick={close}
            className="absolute right-2 top-0 flex h-7 w-7 items-center justify-center rounded-[4px] text-text-subtle hover:bg-surface-overlay-hovered transition-colors"
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div className="flex flex-col">
          <MenuItem label="Add card" onClick={handleAddCard} />
          <MenuItem label="Copy list" />
          <MenuItem label="Move list" />
          <MenuItem label="Move all cards in this list" />
          <MenuItem label="Sort by..." />
          <MenuItem label="Watch" />

          <MenuSeparator />

          {/* Change list color section */}
          <MenuSection title="Change list color">
            <div className="px-3 py-2">
              <p className="text-[14px] font-semibold text-text-default mb-1">Upgrade to change list colors</p>
              <p className="text-[12px] text-text-subtle mb-2">
                List colors can make your board fun and help organize your board visually.
              </p>
              <a className="text-[14px] text-text-link underline cursor-pointer hover:text-[#85b8ff]">
                Start free trial
              </a>
            </div>
          </MenuSection>

          <MenuSeparator />

          {/* Automation section */}
          <MenuSection title="Automation">
            <MenuItem label="When a card is added to the list..." />
            <MenuItem label="Every day, sort list by..." />
            <MenuItem label="Every Monday, sort list by..." />
            <MenuItem label="Create a rule" />
          </MenuSection>

          <MenuSeparator />

          {/* Power-Ups section */}
          <MenuSection title="Power-Ups">
            <MenuItem label="Set list limit" />
          </MenuSection>

          <MenuSeparator />

          <MenuItem label="Archive this list" />
          <MenuItem label="Archive all cards in this list" />
        </div>
      </div>
    </>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-[6px] text-left text-[14px] text-text-default hover:bg-surface-overlay-hovered transition-colors duration-[85ms]"
      role="menuitem"
    >
      {label}
    </button>
  );
}

function MenuSeparator() {
  return <div className="mx-3 my-2 h-px bg-[#a6c5e229]" />;
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <button className="flex w-full items-center justify-between px-3 py-[6px] text-[14px] font-semibold text-text-default">
        {title}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 10l4-4 4 4" />
        </svg>
      </button>
      {children}
    </div>
  );
}
