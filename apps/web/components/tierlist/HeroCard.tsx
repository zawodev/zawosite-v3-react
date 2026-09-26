import Image from 'next/image';
import { heroImgSrc, heroDisplayName } from '@/components/tierlist/constants';

interface HeroCardProps {
  hero: string;
  size?: number;
  dragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

/** Kafelek hero — obrazek + nazwa na hover. Używany zarówno w edytorze jak i readonly. */
export function HeroCard({ hero, size = 64, dragging, dragHandleProps }: HeroCardProps) {
  return (
    <div
      title={heroDisplayName(hero)}
      className={`relative shrink-0 overflow-hidden rounded-md border border-white/10 transition-all select-none
        ${dragging ? 'opacity-50 scale-95 shadow-xl ring-2 ring-primary/60' : 'hover:scale-105 hover:z-10 hover:border-white/30'}`}
      style={{ width: size, height: size }}
      {...dragHandleProps}
    >
      <Image
        src={heroImgSrc(hero)}
        alt={heroDisplayName(hero)}
        fill
        sizes={`${size}px`}
        className="object-cover object-top"
        draggable={false}
      />
    </div>
  );
}
