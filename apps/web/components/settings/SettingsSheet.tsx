'use client';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
import { useTheme } from 'next-themes';
import { Settings, Sun, Moon } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Card do wyboru motywu — jeden z wariantów shadcn ChoiceCard
function ThemeCard({
    value,
    label,
    icon: Icon,
    current,
    onSelect,
}: {
    value: string;
    label: string;
    icon: typeof Sun;
    current: string | undefined;
    onSelect: (v: string) => void;
}) {
    const selected = current === value;
    return (
        <button
            onClick={() => onSelect(value)}
            className={cn(
                'flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors',
                selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            aria-pressed={selected}
        >
            <Icon className="h-5 w-5" />
            {label}
        </button>
    );
}

export function SettingsSheet() {
    const { theme, setTheme } = useTheme();

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
                    <SheetDescription>Dostosuj wygląd strony.</SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-6 px-4">
                    <section className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Motyw
                        </h3>
                        <div className="flex gap-2">
                            <ThemeCard
                                value="light"
                                label="Jasny"
                                icon={Sun}
                                current={theme}
                                onSelect={setTheme}
                            />
                            <ThemeCard
                                value="dark"
                                label="Ciemny"
                                icon={Moon}
                                current={theme}
                                onSelect={setTheme}
                            />
                        </div>
                    </section>
                </div>
            </SheetContent>
        </Sheet>
    );
}
