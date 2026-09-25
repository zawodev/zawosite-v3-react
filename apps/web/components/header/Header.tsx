'use client';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
import { NavBar } from '@/components/header/NavBar';
import { DiscordAuthButton } from '@/components/header/DiscordAuthButton';
import { SettingsSheet } from '@/components/settings/SettingsSheet';

/**
 * Główny header aplikacji.
 * Lewa strona: nawigacja (NavBar)
 * Prawa strona: przycisk Discord (po lewej) + ustawienia (po prawej)
 */
export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <NavBar />
                <div className="flex items-center gap-1">
                    <DiscordAuthButton />
                    <SettingsSheet />
                </div>
            </div>
        </header>
    );
}
