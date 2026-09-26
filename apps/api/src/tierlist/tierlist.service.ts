import { Injectable, ForbiddenException } from '@nestjs/common';
import { Temporal } from '@js-temporal/polyfill';
import { PrismaService } from '../prisma/prisma.service.js';

const ALLOWED_ROLES = ['USER', 'ADMIN'];

@Injectable()
export class TierlistService {
    constructor(private readonly prisma: PrismaService) {}

    private get db() {
        return this.prisma.client;
    }

    async findByUserId(userId: number) {
        return this.db.orm.public.Tierlist.first({ userId });
    }

    /** Wszystkie tierlisty posortowane po dacie aktualizacji (najnowsze pierwsze) */
    async findAll() {
        const rows = await this.db.orm.public.Tierlist.all();
        return rows.sort((a, b) =>
            Temporal.PlainDateTime.compare(
                String(b.updatedAt),
                String(a.updatedAt),
            ),
        );
    }

    /**
     * Tworzy lub aktualizuje tierlistę usera.
     * Wymaga roli USER lub ADMIN — sprawdzane tutaj, żeby nie duplikować logiki.
     */
    async upsert(userId: number, entries: Record<string, any>) {
        // Sprawdzenie roli
        const user = await this.db.orm.public.User.first({ id: userId });
        if (!user || !ALLOWED_ROLES.includes(user.role)) {
            throw new ForbiddenException('Niewystarczające uprawnienia. Potrzebujesz roli USER lub ADMIN.');
        }

        const entriesJson = JSON.stringify(entries);
        const now = Temporal.Now.plainDateTimeISO();
        const existing = await this.findByUserId(userId);

        if (existing) {
            return this.db.orm.public.Tierlist.where({ id: existing.id }).update({
                entries: entriesJson,
                updatedAt: now,
            });
        }

        return this.db.orm.public.Tierlist.create({
            userId,
            entries: entriesJson,
            updatedAt: now,
        });
    }
}
