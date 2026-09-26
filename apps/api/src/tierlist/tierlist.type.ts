import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from '../user/user.type.js';

@ObjectType()
export class TierlistType {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    /** Przechowywane jako JSON string w DB, serializowane do obiektu przez resolver */
    @Field(() => Object)
    entries: Record<string, any>;

    @Field()
    updatedAt: string;

    @Field(() => UserType)
    user: UserType;
}
