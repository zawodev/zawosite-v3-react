// ============================================================
// Stałe tierlisty Deadlock — jedyne miejsce gdzie definiujemy
// kolejność, nazwy i ścieżki obrazków.
// ============================================================

export const TIERS = [
  { id: 'S', label: 'Main' },
  { id: 'A', label: 'Alt-Main' },
  { id: 'B', label: 'Nie ma tragedii' },
  { id: 'C', label: 'Raczej nie dla mnie' },
  { id: 'D', label: 'NIE NIE NIE' },
  { id: 'E', label: 'N/A trzeba sprawdzić' },
] as const;

export type TierId = (typeof TIERS)[number]['id'];

/** Lista wszystkich heroów */
export const HEROES = [
  'abrams', 'bebop', 'billy', 'calico', 'doorman', 'drifter', 'dynamo',
  'grey-talon', 'haze', 'holliday', 'infernus', 'ivy', 'kelvin', 'lady-geist',
  'lash', 'mcginnis', 'mina', 'mirage', 'moandkrill', 'paige', 'paradox',
  'pocket', 'seven', 'shiv', 'sinclair', 'victor', 'vindicta', 'viscous',
  'vyper', 'warden', 'zfathom', 'zraven', 'ztrapper', 'zwrecker', 'zzboho',
  'graves', 'silver', 'venator', 'celeste', 'rem', 'apollo',
] as const;

export type HeroId = (typeof HEROES)[number];

export type TierlistEntries = Record<TierId, string[]>;

/** Ścieżka do obrazka hero */
export const heroImgSrc = (hero: string) => `/programs/tierlist/${hero}.png`;

/** Wyświetlana nazwa hero (first letter cap, '-' → spacja) */
export const heroDisplayName = (hero: string) =>
  hero.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Domyślne uporządkowanie: wszyscy bohaterowie w tierze E */
export const defaultEntries = (): TierlistEntries => ({
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  E: [...HEROES],
});

/**
 * Normalizuje dane z bazy (obsługuje zarówno nowy format { S: ['abrams', ...] },
 * jak i stary format { abrams: 'S' }, dbając o zachowanie kolejności wewnątrz tierów).
 */
export function normalizeEntries(raw: unknown): TierlistEntries {
  const result: TierlistEntries = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
  };

  if (!raw || typeof raw !== 'object') {
    result.E = [...HEROES];
    return result;
  }

  const obj = raw as Record<string, unknown>;

  // Sprawdzamy czy to nowy format { S: [...], A: [...], ... }
  const isNewFormat = TIERS.some((t) => Array.isArray(obj[t.id]));

  if (isNewFormat) {
    const placed = new Set<string>();
    for (const { id } of TIERS) {
      const list = Array.isArray(obj[id]) ? (obj[id] as string[]) : [];
      result[id] = list.filter((hero) => {
        if (typeof hero === 'string' && HEROES.includes(hero as any) && !placed.has(hero)) {
          placed.add(hero);
          return true;
        }
        return false;
      });
    }
    // Każdy hero, który nie był jeszcze w żadnym tierze trafia do E
    for (const hero of HEROES) {
      if (!placed.has(hero)) {
        result.E.push(hero);
      }
    }
    return result;
  }

  // Stary format: { "heroName": "tierId" }
  const placed = new Set<string>();
  for (const hero of HEROES) {
    const tier = obj[hero];
    if (typeof tier === 'string' && tier in result) {
      result[tier as TierId].push(hero);
      placed.add(hero);
    }
  }
  // Każdy hero, który nie był przypisany trafia do E
  for (const hero of HEROES) {
    if (!placed.has(hero)) {
      result.E.push(hero);
    }
  }
  return result;
}

/** Kolor etykiety tieru */
export const TIER_COLORS: Record<string, string> = {
  S: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  A: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  B: 'bg-green-500/20 text-green-300 border-green-500/40',
  C: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  D: 'bg-red-500/20 text-red-300 border-red-500/40',
  E: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/40',
};
