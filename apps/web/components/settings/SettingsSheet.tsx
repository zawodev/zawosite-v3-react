'use client';

import { useTheme } from 'next-themes';
import { Settings } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * Global site settings panel.
 * SheetTrigger (gear icon) can be placed anywhere in the application.
 * The Sheet slides in from the right side.
 */
export function SettingsSheet() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Sheet>
            <SheetTrigger
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Otwórz ustawienia"
            >
                <Settings className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Ustawienia</SheetTitle>
                    <SheetDescription>Dostosuj wygląd i zachowanie strony.</SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-6 px-4">
                    {/* Dark / Light mode toggle */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme-toggle" className="flex flex-col gap-1">
                            <span>Tryb ciemny</span>
                            <span className="text-xs font-normal text-muted-foreground">
                                Przełącz między jasnym a ciemnym motywem
                            </span>
                        </Label>
                        <Switch
                            id="theme-toggle"
                            checked={isDark}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>

                    {/* future side settings here */}
                </div>
            </SheetContent>
        </Sheet>
    );
}
