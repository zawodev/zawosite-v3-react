'use client';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { SiteLogo } from '@/components/header/SiteLogo';
import { cn } from '@/lib/utils';

interface DropdownItem {
    label: string;
    href: string;
    description: string;
    disabled?: boolean;
}

// --- Definicje linków ---

const appItems: DropdownItem[] = [
    { label: 'app1', href: '/apps/app1', description: 'coming soon placeholder' },
    { label: 'app2', href: '/apps/app2', description: 'coming soon placeholder' },
];

const programItems: DropdownItem[] = [
    {
        label: 'stickers',
        href: '/programs/stickers',
        disabled: true,
        description: 'folder naklejki smieszne',
    },
    {
        label: 'notes',
        href: '/programs/notes',
        disabled: true,
        description: 'moje notatki wszelakie',
    },
    {
        label: 'pulse',
        href: '/programs/pulse',
        disabled: true,
        description: 'ten w sumie jest słaby, wywal',
    },
    {
        label: 'tierlist',
        href: '/programs/tierlist',
        disabled: false,
        description: 'deadlock postacie tierlist',
    },
];

// DropdownLink — link w menu rozwijanym z opisem
function DropdownLink({ item }: { item: DropdownItem }) {
    return (
        <NavigationMenuLink
            href={item.disabled ? undefined : item.href}
            className={cn(
                'flex w-full flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-sm',
                item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-accent hover:text-accent-foreground',
            )}
            aria-disabled={item.disabled}
        >
            <span className="flex items-center gap-1.5 font-medium">
                {item.disabled && <Lock className="h-3 w-3 shrink-0" />}
                {item.label}
            </span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
        </NavigationMenuLink>
    );
}

export function NavBar() {
    const pathname = usePathname();

    const isAppsActive = appItems.some((i) => pathname.startsWith(i.href));
    const isProgramsActive = programItems.some((i) => pathname.startsWith(i.href));

    return (
        <div className="flex items-center gap-4">
            <SiteLogo />

            {/* Nawigacja — kolejność: Apps | Programs | CV */}
            <NavigationMenu>
                <NavigationMenuList className="gap-1">
                    {/* Apps */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger
                            className={cn(
                                'px-4 py-2 text-sm font-medium',
                                isAppsActive && 'bg-muted/50',
                            )}
                        >
                            apps
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-56 p-1.5">
                                {appItems.map((item) => (
                                    <li key={item.href}>
                                        <DropdownLink item={item} />
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Programs */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger
                            className={cn(
                                'px-4 py-2 text-sm font-medium',
                                isProgramsActive && 'bg-muted/50',
                            )}
                        >
                            programs
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-56 p-1.5">
                                {programItems.map((item) => (
                                    <li key={item.href}>
                                        <DropdownLink item={item} />
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* CV — zwykły link */}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/about-me"
                            active={pathname === '/about-me'}
                            className="px-4 py-2 text-sm font-medium"
                        >
                            about me
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
