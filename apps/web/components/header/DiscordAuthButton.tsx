'use client';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DiscordIcon } from '@/components/icons';

interface User {
    id: number;
    discordId: string;
    username: string;
    globalName?: string;
    avatar?: string;
    email?: string;
}

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 2000;

async function fetchCurrentUser(backendUrl: string, signal: AbortSignal): Promise<User | null> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await fetch(`${backendUrl}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                signal,
                body: JSON.stringify({
                    query: `query GetMe { me { id discordId username globalName avatar email } }`,
                }),
            });
            const json = await res.json();
            return json.data?.me ?? null;
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return null;
            if (attempt === MAX_RETRIES) {
                console.error(
                    `[zawosite] Nie udało się połączyć z backendem po ${MAX_RETRIES} próbach.`,
                    err,
                );
                return null;
            }
            await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
        }
    }
    return null;
}

export function DiscordAuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!backendUrl) {
            console.error('[zawosite] NEXT_PUBLIC_BACKEND_URL is required in .env!');
            setLoading(false);
            return;
        }
        const controller = new AbortController();
        fetchCurrentUser(backendUrl, controller.signal).then((result) => {
            if (!controller.signal.aborted) {
                setUser(result);
                setLoading(false);
            }
        });
        return () => controller.abort();
    }, [backendUrl]);

    const openMenu = () => {
        clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 150);
    };

    const handleLogin = () => {
        if (backendUrl) window.location.href = `${backendUrl}/auth/discord`;
    };
    const handleLogout = () => {
        if (backendUrl) window.location.href = `${backendUrl}/auth/logout`;
    };

    if (loading) {
        return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
    }

    if (user) {
        const avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
        const displayName = user.globalName ?? user.username;
        const initials = displayName.slice(0, 2).toUpperCase();

        return (
            // Wrapper zarządza hover-em — otwiera dropdown na najechanie myszą
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger
                        className="cursor-pointer rounded-full outline-none ring-2 ring-transparent transition-all hover:ring-primary focus-visible:ring-primary"
                        aria-label={`Menu użytkownika: ${displayName}`}
                    >
                        <Avatar>
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        onMouseEnter={openMenu}
                        onMouseLeave={closeMenu}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                <p className="font-semibold">{displayName}</p>
                                <p className="text-xs font-normal text-muted-foreground">
                                    @{user.username}
                                </p>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push(`/user/${user.username}`)}
                        >
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleLogout}
                            variant="destructive"
                            className="cursor-pointer"
                        >
                            Wyloguj się
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    /* Niezalogowany — ghost button jak SettingsSheet */
    return (
        <button
            onClick={handleLogin}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Zaloguj przez Discord"
            title="Zaloguj przez Discord"
        >
            <DiscordIcon className="h-4 w-4" />
        </button>
    );
}
