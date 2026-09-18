'use client';

import { usePathname } from 'next/navigation';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    /** If true, the link appears disabled (e.g. requires a role).
     * Will be controlled by the backend in the future.
     * */
    disabled?: boolean;
}

// example tabs — will be controlled by roles from the backend in the future
const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Projekty', href: '/projects' },
    { label: 'Ranking', href: '/ranking' },
    { label: 'Admin', href: '/admin', disabled: true },
];

export function NavBar() {
    const pathname = usePathname();

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-1">
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink
                            href={item.disabled ? undefined : item.href}
                            active={pathname === item.href}
                            className={cn(
                                'px-4 py-2 text-sm font-medium',
                                item.disabled &&
                                    'opacity-40 cursor-not-allowed pointer-events-none',
                            )}
                            aria-disabled={item.disabled}
                        >
                            {item.label}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
