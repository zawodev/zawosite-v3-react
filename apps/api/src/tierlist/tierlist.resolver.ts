import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { TierlistType } from './tierlist.type.js';
import { TierlistService } from './tierlist.service.js';
import { UserType } from '../user/user.type.js';
import { UserService } from '../user/user.service.js';

@Resolver(() => TierlistType)
export class TierlistResolver {
    constructor(
        private readonly tierlistService: TierlistService,
        private readonly userService: UserService,
    ) {}

    /** Tierlista zalogowanego usera (null jeśli nie istnieje) */
    @Query(() => TierlistType, { name: 'myTierlist', nullable: true })
    async myTierlist(@Context() context: any) {
        const userId = context.req?.userId;
        if (!userId) return null;
        const row = await this.tierlistService.findByUserId(userId);
        return row ? this.mapRow(row) : null;
    }

    /** Wszystkie tierlisty — posortowane po updatedAt DESC (dla walla) */
    @Query(() => [TierlistType], { name: 'allTierlists' })
    async allTierlists() {
        const rows = await this.tierlistService.findAll();
        return rows.map(this.mapRow);
    }

    /** Zapis tierlisty (wymaga roli USER lub ADMIN — sprawdzane w serwisie) */
    @Mutation(() => TierlistType, { name: 'saveTierlist' })
    async saveTierlist(
        @Args('entries', { type: () => Object }) entries: Record<string, string>,
        @Context() context: any,
    ) {
        const userId = context.req?.userId;
        if (!userId) throw new Error('Nie jesteś zalogowany.');
        const row = await this.tierlistService.upsert(userId, entries);
        return this.mapRow(row as any);
    }

    /** Dołącz dane usera dla każdej tierlisty */
    @ResolveField(() => UserType)
    async user(@Parent() tierlist: TierlistType) {
        return this.userService.findById(tierlist.userId);
    }

    /** Parsuje entries z JSON string i normalizuje updatedAt do ISO string */
    private mapRow(row: { id: number; userId: number; entries: string; updatedAt: unknown }) {
        const updatedAt = row.updatedAt != null ? String(row.updatedAt) : new Date().toISOString();
        return {
            ...row,
            entries: JSON.parse(row.entries as string) as Record<string, any>,
            updatedAt,
        };
    }
}
