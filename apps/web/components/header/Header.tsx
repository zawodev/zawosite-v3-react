import { NavBar } from '@/components/header/NavBar';
import { DiscordAuthButton } from '@/components/header/DiscordAuthButton';
import { SettingsSheet } from '@/components/settings/SettingsSheet';

/**
 * Main application header.
 * Left side: navigation (NavBar)
 * Right side: settings panel + Discord login button
 */
export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
                {/* left side - nav */}
                <NavBar />

                {/* right side - settings + auth + more */}
                <div className="flex items-center gap-3">
                    <SettingsSheet />
                    <DiscordAuthButton />
                </div>
            </div>
        </header>
    );
}
