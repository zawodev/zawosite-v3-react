import { Resolver, Query, Context } from '@nestjs/graphql';
import { UserType } from './user.type.js';
import { UserService } from './user.service.js';

@Resolver(() => UserType)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserType, { name: 'me', nullable: true })
    async me(@Context() context: any) {
        const userId = context.req?.userId;
        if (!userId) {
            return null;
        }
        return this.userService.findById(userId);
    }
}
