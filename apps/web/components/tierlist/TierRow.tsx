import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HeroCard } from '@/components/tierlist/HeroCard';
import { TIER_COLORS } from '@/components/tierlist/constants';

interface TierRowEditorProps {
  tierId: string;
  tierLabel: string;
  heroes: string[];
  activeHero: string | null;
}

function SortableHero({ hero, isActive }: { hero: string; isActive: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: hero });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="touch-none"
    >
      <HeroCard
        hero={hero}
        dragging={isDragging || isActive}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

/** Jeden tier z droppable zone i SortableContext — używany w edytorze */
export function TierRowEditor({ tierId, tierLabel, heroes, activeHero }: TierRowEditorProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tierId });
  const colorClass = TIER_COLORS[tierId] ?? TIER_COLORS['E'];

  return (
    <div className="flex min-h-[72px] items-stretch border-b border-white/5 last:border-0">
      {/* Etykieta tieru */}
      <div className={`flex w-24 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-white/10 p-2 text-center select-none ${colorClass}`}>
        <span className="text-lg font-bold leading-none">{tierId}</span>
        <span className="text-[10px] leading-tight opacity-80">{tierLabel}</span>
      </div>

      {/* Sortable Drop zone z kafelkami */}
      <SortableContext id={tierId} items={heroes} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-1 flex-wrap content-start gap-1.5 p-2 transition-colors ${
            isOver ? 'bg-white/5' : ''
          }`}
        >
          {heroes.map((hero) => (
            <SortableHero key={hero} hero={hero} isActive={activeHero === hero} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// ── Readonly tier row (do walla) ──────────────────────────────

interface TierRowReadonlyProps {
  tierId: string;
  tierLabel: string;
  heroes: string[];
  heroSize?: number;
}

export function TierRowReadonly({ tierId, tierLabel, heroes, heroSize = 48 }: TierRowReadonlyProps) {
  const colorClass = TIER_COLORS[tierId] ?? TIER_COLORS['E'];

  return (
    <div className="flex min-h-[56px] items-stretch border-b border-white/5 last:border-0">
      <div className={`flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-white/10 p-1.5 text-center text-xs select-none ${colorClass}`}>
        <span className="text-base font-bold leading-none">{tierId}</span>
        <span className="text-[9px] leading-tight opacity-80">{tierLabel}</span>
      </div>
      <div className="flex flex-1 flex-wrap content-start gap-1 p-1.5">
        {heroes.map((hero) => (
          <HeroCard key={hero} hero={hero} size={heroSize} />
        ))}
      </div>
    </div>
  );
}
