import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { User } from '@repo/database';

export interface DiscordProfile {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
    email?: string | null;
}

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    private get db() {
        return this.prisma.client;
    }

    async findById(id: number): Promise<User | null> {
        return this.db.orm.public.User.first({ id });
    }

    async findByDiscordId(discordId: string): Promise<User | null> {
        return this.db.orm.public.User.first({ discordId });
    }

    async upsertFromDiscord(profile: DiscordProfile) {
        const existing = await this.findByDiscordId(profile.id);

        if (existing) {
            // Aktualizacja danych usera (np. nowy avatar)
            return this.db.orm.public.User.where({ id: existing.id }).update({
                username: profile.username,
                globalName: profile.global_name ?? null,
                avatar: profile.avatar ?? null,
                email: profile.email ?? null,
            });
        }

        // Tworzenie nowego usera
        return this.db.orm.public.User.create({
            discordId: profile.id,
            username: profile.username,
            globalName: profile.global_name ?? null,
            avatar: profile.avatar ?? null,
            email: profile.email ?? null,
        });
    }
}
