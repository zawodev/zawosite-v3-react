'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
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

/**
 * Fetches the currently logged-in user from GraphQL.
 * On a network error (backend is not up yet), retries every RETRY_INTERVAL_MS
 * up to MAX_RETRIES times. Logs the error only after all retries have been exhausted.
 * signal — AbortSignal used to cancel the request when the component is unmounted.
 */
async function fetchCurrentUser(backendUrl: string, signal: AbortSignal): Promise<User | null> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await fetch(`${backendUrl}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                signal,
                body: JSON.stringify({
                    query: `
            query GetMe {
              me {
                id
                discordId
                username
                globalName
                avatar
                email
              }
            }
          `,
                }),
            });

            const json = await res.json();
            return json.data?.me ?? null;
        } catch (err) {
            // AbortError = component unmounted, stop without logging
            if (err instanceof DOMException && err.name === 'AbortError') return null;

            const isLastAttempt = attempt === MAX_RETRIES;

            if (isLastAttempt) {
                console.error(
                    `[zawosite] Failed to connect to the backend after ${MAX_RETRIES} attempts.`,
                    err,
                );
                return null;
            }

            // wait before retrying
            await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
        }
    }

    return null;
}

export function DiscordAuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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

        // cancel the fetch when the component is unmounted
        return () => controller.abort();
    }, [backendUrl]);

    const handleLogin = () => {
        if (!backendUrl) return;
        window.location.href = `${backendUrl}/auth/discord`;
    };

    const handleLogout = () => {
        if (!backendUrl) return;
        window.location.href = `${backendUrl}/auth/logout`;
    };

    const avatarUrl = user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const displayName = user?.globalName ?? user?.username ?? '';
    const initials = displayName.slice(0, 2).toUpperCase();

    if (loading) {
        return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
    }

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="cursor-pointer rounded-full outline-none ring-2 ring-transparent hover:ring-primary transition-all focus-visible:ring-primary"
                    aria-label={`Menu użytkownika: ${displayName}`}
                >
                    <Avatar>
                        <AvatarImage src={avatarUrl} alt={displayName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        <p className="font-semibold">{displayName}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                            @{user.username}
                        </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        Wyloguj się
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button onClick={handleLogin} className="bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2">
            <DiscordIcon className="h-4 w-4" />
        </Button>
    );
}
