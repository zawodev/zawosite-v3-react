'use client';

import { usePathname } from 'next/navigation';
import { AnimatedBackground } from '@/components/backgrounds/AnimatedBackground';
import { BackgroundDots } from '@/components/backgrounds/BackgroundDots';

export function BackgroundRenderer() {
    const pathname = usePathname();
    // prosty check: jeśli home, to animated, jak nie to dots
    return pathname === '/' ? <AnimatedBackground /> : <BackgroundDots />;
}
