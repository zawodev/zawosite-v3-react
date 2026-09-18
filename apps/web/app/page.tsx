'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface User {
    id: number;
    discordId: string;
    username: string;
    globalName?: string;
    avatar?: string;
    email?: string;
}

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!backendUrl) {
            console.error('[Web Error] NEXT_PUBLIC_BACKEND_URL is required in .env!');
            setLoading(false);
            return;
        }

        // Odpytujemy GraphQL o zalogowanego usera
        fetch(`${backendUrl}/graphql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // BARDZO WAŻNE: wysyła ciasteczko sesyjne z portu 3000 do 4000
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
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.data?.me) {
                    setUser(res.data.me);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [backendUrl]);

    const handleLogin = () => {
        if (!backendUrl) return;
        window.location.href = `${backendUrl}/auth/discord`;
    };

    const handleLogout = () => {
        if (!backendUrl) return;
        window.location.href = `${backendUrl}/auth/logout`;
    };

    // Obliczenie linku do avatara Discorda
    const avatarUrl = user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Zawosite</CardTitle>
                    <CardDescription className="text-zinc-400">
                        {user ? 'Jesteś zalogowany' : 'Zaloguj się, aby kontynuować'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    {loading ? (
                        <p className="text-zinc-500 animate-pulse">Ładowanie...</p>
                    ) : user ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <img
                                src={avatarUrl}
                                alt={user.username}
                                className="w-24 h-24 rounded-full border-2 border-indigo-500 shadow-md"
                            />
                            <div className="text-center">
                                <h3 className="text-xl font-semibold">
                                    {user.globalName ?? user.username}
                                </h3>
                                <p className="text-sm text-zinc-400">@{user.username}</p>
                                {user.email && (
                                    <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
                                )}
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full mt-2"
                                onClick={handleLogout}
                            >
                                Wyloguj się
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-2 font-medium py-6"
                            onClick={handleLogin}
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                            </svg>
                            Zaloguj przez Discord
                        </Button>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
