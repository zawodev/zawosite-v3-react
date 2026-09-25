'use client';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
import { createContext, useContext, useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DotsConfig {
    /** Średnica każdej kropki w px (1–4) */
    dotSize: number;
    /** Odstęp między kropkami w px (12–48) */
    spacing: number;
    /** Jak mocno zanika na krawędziach (0–1) */
    edgeDarkness: number;
}

export interface BlobsConfig {
    /** Liczba blobów (2–8) */
    blobCount: number;
    /** Rozmiar bloba w px (200–700) */
    blobSize: number;
    /** Czas pełnej animacji w sekundach — im wyższy, tym wolniej (10–60) */
    speed: number;
    /** Preset kolorów */
    colorPreset: keyof typeof COLOR_PRESETS;
}

// ---------------------------------------------------------------------------
// Color presets
// ---------------------------------------------------------------------------

export const COLOR_PRESETS = {
    purple: ['#7c3aed', '#4f46e5', '#a855f7', '#6366f1'],
    ocean: ['#0891b2', '#0ea5e9', '#06b6d4', '#2563eb'],
    sunset: ['#dc2626', '#ea580c', '#d97706', '#f59e0b'],
    forest: ['#16a34a', '#059669', '#0891b2', '#4f46e5'],
    rose: ['#e11d48', '#db2777', '#9333ea', '#7c3aed'],
} as const;

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_DOTS: DotsConfig = { dotSize: 1.5, spacing: 24, edgeDarkness: 0.85 };
const DEFAULT_BLOBS: BlobsConfig = {
    blobCount: 5,
    blobSize: 420,
    speed: 22,
    colorPreset: 'purple',
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface BackgroundContextValue {
    dots: DotsConfig;
    setDots: (patch: Partial<DotsConfig>) => void;
    blobs: BlobsConfig;
    setBlobs: (patch: Partial<BlobsConfig>) => void;
}

const BackgroundContext = createContext<BackgroundContextValue>({
    dots: DEFAULT_DOTS,
    setDots: () => {},
    blobs: DEFAULT_BLOBS,
    setBlobs: () => {},
});

export function BackgroundProvider({ children }: { children: ReactNode }) {
    const [dots, setDotsState] = useState<DotsConfig>(DEFAULT_DOTS);
    const [blobs, setBlobsState] = useState<BlobsConfig>(DEFAULT_BLOBS);

    const setDots = (patch: Partial<DotsConfig>) => setDotsState((prev) => ({ ...prev, ...patch }));

    const setBlobs = (patch: Partial<BlobsConfig>) =>
        setBlobsState((prev) => ({ ...prev, ...patch }));

    return (
        <BackgroundContext value={{ dots, setDots, blobs, setBlobs }}>{children}</BackgroundContext>
    );
}

export function useBackground() {
    return useContext(BackgroundContext);
}
