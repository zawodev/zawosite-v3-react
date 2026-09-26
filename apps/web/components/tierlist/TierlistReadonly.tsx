import { TIERS, normalizeEntries, type TierlistEntries } from '@/components/tierlist/constants';
import { TierRowReadonly } from '@/components/tierlist/TierRow';

interface TierlistReadonlyProps {
  entries: TierlistEntries | Record<string, any>;
  heroSize?: number;
}

/** Statyczny widok tierlisty — używany na wallu dla innych userów z zachowaniem dokładnej kolejności */
export function TierlistReadonly({ entries, heroSize = 48 }: TierlistReadonlyProps) {
  const normalized = normalizeEntries(entries);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-background/60">
      {TIERS.map(({ id, label }) => (
        <TierRowReadonly
          key={id}
          tierId={id}
          tierLabel={label}
          heroes={normalized[id] ?? []}
          heroSize={heroSize}
        />
      ))}
    </div>
  );
}
