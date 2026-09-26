'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  TIERS,
  normalizeEntries,
  type TierId,
  type TierlistEntries,
} from '@/components/tierlist/constants';
import { TierRowEditor } from '@/components/tierlist/TierRow';
import { HeroCard } from '@/components/tierlist/HeroCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const DEBOUNCE_MS = 1500;

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

async function gqlSave(entries: TierlistEntries) {
  const res = await fetch(`${BACKEND_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      query: `mutation SaveTierlist($entries: JSON!) { saveTierlist(entries: $entries) { id updatedAt } }`,
      variables: { entries },
    }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data.saveTierlist;
}

interface TierlistEditorProps {
  initialEntries: unknown;
  onStatusChange?: (status: SaveStatus) => void;
}

/** Pomocnicza funkcja znajdująca kontener (tier) dla danego ID hero lub tieru */
function findContainer(id: string, items: TierlistEntries): TierId | undefined {
  if (id in items) {
    return id as TierId;
  }
  return (Object.keys(items) as TierId[]).find((tier) =>
    items[tier].includes(id),
  );
}

/**
 * Edytowalny edytor tierlisty z sortable drag & drop i debounced autosave.
 * Pamięta dokładną kolejność (indeksy 0, 1, 2...) wewnątrz każdego tieru.
 */
export function TierlistEditor({ initialEntries, onStatusChange }: TierlistEditorProps) {
  const [entries, setEntries] = useState<TierlistEntries>(() =>
    normalizeEntries(initialEntries),
  );
  const [activeHero, setActiveHero] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Refy trzymające aktualny stan dla eventów DnD i timera
  const entriesRef = useRef<TierlistEntries>(entries);
  entriesRef.current = entries;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updateStatus = useCallback(
    (status: SaveStatus) => {
      setSaveStatus(status);
      onStatusChange?.(status);
    },
    [onStatusChange],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const scheduleSave = useCallback(
    (nextEntries: TierlistEntries) => {
      clearTimeout(debounceTimer.current);
      updateStatus('pending');
      debounceTimer.current = setTimeout(async () => {
        updateStatus('saving');
        try {
          await gqlSave(nextEntries);
          updateStatus('saved');
          setTimeout(() => updateStatus('idle'), 3000);
        } catch (err) {
          console.error('[Tierlist] Błąd zapisu:', err);
          updateStatus('error');
        }
      }, DEBOUNCE_MS);
    },
    [updateStatus],
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveHero(String(active.id));
  };

  /** Przenoszenie elementu pomiędzy różnymi tierami w trakcie przeciągania */
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId, entriesRef.current);
    const overContainer = findContainer(overId, entriesRef.current);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setEntries((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      let newIndex: number;
      if (overId in prev) {
        // Upuszczono na pusty kontener tieru
        newIndex = overItems.length;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      const next = {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item !== activeId),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeId,
          ...overItems.slice(newIndex),
        ],
      };
      entriesRef.current = next;
      return next;
    });
  };

  /** Zakończenie przeciągania i zapisanie kolejności */
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveHero(null);
    if (!over) {
      // Jeśli upuszczono poza droppable, zapisujemy obecny stan (jeśli był zmieniony w dragOver)
      scheduleSave(entriesRef.current);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId, entriesRef.current);
    const overContainer = findContainer(overId, entriesRef.current);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const activeIndex = entriesRef.current[activeContainer].indexOf(activeId);
      const overIndex = entriesRef.current[overContainer].indexOf(overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const next = {
          ...entriesRef.current,
          [activeContainer]: arrayMove(
            entriesRef.current[activeContainer],
            activeIndex,
            overIndex,
          ),
        };
        setEntries(next);
        entriesRef.current = next;
        scheduleSave(next);
        return;
      }
    }

    // Jeśli zmiana nastąpiła między kontenerami
    scheduleSave(entriesRef.current);
  };

  return (
    <DndContext
      id="deadlock-tierlist"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-hidden rounded-lg border border-white/10 bg-background/60">
        {TIERS.map(({ id, label }) => (
          <TierRowEditor
            key={id}
            tierId={id}
            tierLabel={label}
            heroes={entries[id] ?? []}
            activeHero={activeHero}
          />
        ))}
      </div>

      <DragOverlay>
        {activeHero && <HeroCard hero={activeHero} dragging />}
      </DragOverlay>
    </DndContext>
  );
}
