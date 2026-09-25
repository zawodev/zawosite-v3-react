/**
 * Tło z siatką kropek z efektem zanikania na krawędziach.
 * Używane na wszystkich stronach poza Home.
 *
 * === Konfiguracja (tylko dla developera) ===
 */
const DOT_SIZE = 1.5; // Średnica kropki w px
const SPACING = 24; // Odstęp między kropkami w px
const FADE_START = 0.82; // Gdzie zaczyna się zanikanie (0–1), 0.82 = 82% od środka
const DOT_OPACITY = 0.18; // Krycie kropek (0–1)
// ==========================================
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
export function BackgroundDots() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10"
            style={{
                backgroundImage: `radial-gradient(
          circle,
          color-mix(in srgb, var(--foreground) ${Math.round(DOT_OPACITY * 100)}%, transparent) ${DOT_SIZE}px,
          transparent ${DOT_SIZE}px
        )`,
                backgroundSize: `${SPACING}px ${SPACING}px`,
                maskImage: `radial-gradient(ellipse 85% 85% at 50% 50%, black ${FADE_START * 100}%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(ellipse 85% 85% at 50% 50%, black ${FADE_START * 100}%, transparent 100%)`,
            }}
        />
    );
}
