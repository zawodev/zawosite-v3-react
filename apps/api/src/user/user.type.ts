import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserType {
    @Field(() => Int)
    id: number;

    @Field()
    discordId: string;

    @Field()
    username: string;

    @Field({ nullable: true })
    globalName?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    email?: string;
}
