/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
/**
 * Animowane tło z blobami (gradienty + blur) — używane na stronie Home.
 * Keyframes zdefiniowane w globals.css. Zero zewnętrznych bibliotek — czyste CSS.
 *
 * Bloby są pozycjonowane jako stałe przesunięcia w pikselach od środka viewportu
 * (calc(50% + Xpx)), dzięki czemu wygląd jest niezależny od rozmiaru ekranu —
 * mniejszy viewport pokazuje po prostu inny wycinek tej samej sceny.
 *
 * === Konfiguracja (tylko dla developera) ===
 */
const BLOB_SIZE = 460; // Rozmiar bloba w px
const SPEED = 22; // Czas bazowy animacji w sekundach (wyższy = wolniej)
const OPACITY = 0.32; // Krycie każdego bloba (0–1)
const PALETTE = [
    // Kolory blobów
    '#7c3aed',
    '#4f46e5',
    '#a855f7',
    '#6366f1',
    '#3b82f6',
];
// Stałe pozycje blobów jako [offsetX, offsetY] w pikselach od centrum viewportu.
// Centrum sceny (0, 0) to środek ekranu. Overflow:hidden przycina to co wychodzi poza viewport.
const POSITIONS: [number, number][] = [
    [-480, -280], // lewy górny
    [380, 220], // prawy dolny
    [320, -310], // prawy górny
    [-330, 290], // lewy dolny
    [40, 60], // bliski centrum
    [180, -420], // górny środek-prawo
    [-160, 400], // dolny środek-lewo
    [500, -60], // skrajny prawy
];
// ==========================================

const ANIMATIONS = ['blob-float-1', 'blob-float-2', 'blob-float-3'] as const;

export function AnimatedBackground() {
    const count = Math.min(PALETTE.length, POSITIONS.length);

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {Array.from({ length: count }, (_, i) => {
                const pos = POSITIONS[i];
                if (!pos) return null;

                const [offsetX, offsetY] = pos;
                const color = PALETTE[i % PALETTE.length];
                const animation = ANIMATIONS[i % ANIMATIONS.length];
                const duration = `${SPEED + i * 3}s`;
                const delay = `${-(i * (SPEED / count))}s`;

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            // calc(50% + Xpx) = stałe przesunięcie od centrum viewportu
                            top: `calc(50% + ${offsetY}px)`,
                            left: `calc(50% + ${offsetX}px)`,
                            width: `${BLOB_SIZE}px`,
                            height: `${BLOB_SIZE}px`,
                            background: color,
                            borderRadius: '50%',
                            filter: `blur(${Math.round(BLOB_SIZE * 0.2)}px)`,
                            opacity: OPACITY,
                            // translate(-50%, -50%) centruje bloba na punkcie docelowym
                            transform: 'translate(-50%, -50%)',
                            animation: `${animation} ${duration} ease-in-out ${delay} infinite`,
                            willChange: 'transform',
                        }}
                    />
                );
            })}
        </div>
    );
}
