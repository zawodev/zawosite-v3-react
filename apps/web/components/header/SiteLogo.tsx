import Link from 'next/link';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
/**
 * Logo/brand strony z animowanym gradientem przesuwającym się od prawej do lewej.
 *
 * === Konfiguracja (tylko dla developera) ===
 */
const GRADIENT_COLORS = ['#a855f7', '#818cf8', '#3b82f6', '#a855f7']; // paleta — ostatni kolor = pierwszy dla płynnej pętli
const ANIMATION_DURATION = 5; // sekundy — niżej = szybciej
const FONT_CLASS = 'text-xl font-bold tracking-tight';
// ==========================================

const gradient = `linear-gradient(to right, ${GRADIENT_COLORS.join(', ')})`;

export function SiteLogo() {
    return (
        <Link
            href="/"
            className={FONT_CLASS}
            style={{
                background: gradient,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                animation: `gradient-slide ${ANIMATION_DURATION}s linear infinite`,
                display: 'inline-block',
            }}
        >
            zawosite
        </Link>
    );
}
